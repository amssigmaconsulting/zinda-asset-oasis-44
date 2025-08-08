-- Fix security warning: Function Search Path Mutable
CREATE OR REPLACE FUNCTION public.update_auction_on_bid()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
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
$$;