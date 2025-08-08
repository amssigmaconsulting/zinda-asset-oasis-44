-- Create some sample listing views to demonstrate analytics
INSERT INTO public.listing_views (listing_id, viewer_ip, viewed_at)
SELECT 
  pl.id,
  '192.168.1.' || (floor(random() * 100) + 100)::text,
  now() - (random() * interval '30 days')
FROM public.property_listings pl
CROSS JOIN generate_series(1, 15) -- Generate 15 views per listing
WHERE pl.status = 'active';

-- Also add some views with user IDs to show unique viewers
INSERT INTO public.listing_views (listing_id, viewer_user_id, viewer_ip, viewed_at)
SELECT 
  pl.id,
  pl.user_id, -- Use the owner's user_id as a sample viewer
  '10.0.0.' || (floor(random() * 100) + 1)::text,
  now() - (random() * interval '7 days')
FROM public.property_listings pl
CROSS JOIN generate_series(1, 5) -- Generate 5 additional views with user IDs
WHERE pl.status = 'active';