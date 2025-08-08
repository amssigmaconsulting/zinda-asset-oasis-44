-- Allow anyone to view active listings for public display
CREATE POLICY "Anyone can view active listings for public display" 
ON public.property_listings 
FOR SELECT 
USING (status = 'active');