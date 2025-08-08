-- Add listing_purpose field to support both sale and rental listings
ALTER TABLE public.property_listings 
ADD COLUMN listing_purpose TEXT NOT NULL DEFAULT 'sale';

-- Add check constraint to ensure valid values
ALTER TABLE public.property_listings 
ADD CONSTRAINT check_listing_purpose 
CHECK (listing_purpose IN ('sale', 'rent'));

-- Create index for better query performance
CREATE INDEX idx_property_listings_purpose 
ON public.property_listings(listing_purpose);

-- Update RLS policies to allow viewing rental listings publicly
-- First, drop the existing policy that only allows users to view their own listings
DROP POLICY "Users can view their own listings" ON public.property_listings;

-- Create new policies for public viewing of rental listings but restricted viewing of sale listings
CREATE POLICY "Anyone can view rental listings" 
ON public.property_listings 
FOR SELECT 
USING (listing_purpose = 'rent');

CREATE POLICY "Users can view their own sale listings" 
ON public.property_listings 
FOR SELECT 
USING (listing_purpose = 'sale' AND auth.uid() = user_id);

-- Create policy for agents to view all listings (for management purposes)
CREATE POLICY "Users can view all their own listings regardless of purpose" 
ON public.property_listings 
FOR SELECT 
USING (auth.uid() = user_id);