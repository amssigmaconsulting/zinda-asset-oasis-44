-- Create auction listings table
CREATE TABLE public.auction_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_listing_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE,
  starting_bid NUMERIC NOT NULL,
  current_bid NUMERIC NOT NULL,
  bid_increment NUMERIC NOT NULL DEFAULT 50000,
  auction_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_bids INTEGER NOT NULL DEFAULT 0,
  highest_bidder_id UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auction_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active auctions" 
ON public.auction_listings 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own auctions" 
ON public.auction_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own auctions" 
ON public.auction_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_auction_listings_updated_at
BEFORE UPDATE ON public.auction_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create auction bids table
CREATE TABLE public.auction_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_listing_id UUID NOT NULL REFERENCES public.auction_listings(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL,
  bid_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bids
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;

-- Create policies for bids
CREATE POLICY "Anyone can view bids for active auctions" 
ON public.auction_bids 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.auction_listings 
    WHERE id = auction_listing_id AND status = 'active'
  )
);

CREATE POLICY "Users can place bids" 
ON public.auction_bids 
FOR INSERT 
WITH CHECK (auth.uid() = bidder_id);

-- Create function to update auction when bid is placed
CREATE OR REPLACE FUNCTION public.update_auction_on_bid()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.auction_listings 
  SET 
    current_bid = NEW.bid_amount,
    total_bids = total_bids + 1,
    highest_bidder_id = NEW.bidder_id,
    updated_at = now()
  WHERE id = NEW.auction_listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update auction on new bid
CREATE TRIGGER update_auction_on_new_bid
AFTER INSERT ON public.auction_bids
FOR EACH ROW
EXECUTE FUNCTION public.update_auction_on_bid();