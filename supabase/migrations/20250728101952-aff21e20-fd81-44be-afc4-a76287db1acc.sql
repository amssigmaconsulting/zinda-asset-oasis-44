-- Add automobile specific fields to property_listings table
ALTER TABLE public.property_listings 
ADD COLUMN year INTEGER,
ADD COLUMN mileage TEXT,
ADD COLUMN fuel_type TEXT,
ADD COLUMN condition TEXT,
ADD COLUMN make TEXT,
ADD COLUMN model TEXT;