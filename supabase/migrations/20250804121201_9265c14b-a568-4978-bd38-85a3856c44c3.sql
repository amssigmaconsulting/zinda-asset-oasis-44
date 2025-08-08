-- Create function to get listing analytics
CREATE OR REPLACE FUNCTION public.get_listing_analytics(listing_id_param uuid)
RETURNS TABLE(
  total_views bigint,
  unique_viewers bigint,
  views_this_week bigint,
  views_this_month bigint,
  daily_views json
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  week_ago timestamptz := now() - interval '7 days';
  month_ago timestamptz := now() - interval '30 days';
BEGIN
  -- Get total views
  SELECT count(*) INTO total_views
  FROM public.listing_views 
  WHERE listing_views.listing_id = listing_id_param;
  
  -- Get unique viewers (count distinct non-null viewer_user_id)
  SELECT count(DISTINCT viewer_user_id) INTO unique_viewers
  FROM public.listing_views 
  WHERE listing_views.listing_id = listing_id_param 
    AND viewer_user_id IS NOT NULL;
  
  -- Get views this week
  SELECT count(*) INTO views_this_week
  FROM public.listing_views 
  WHERE listing_views.listing_id = listing_id_param 
    AND viewed_at >= week_ago;
  
  -- Get views this month
  SELECT count(*) INTO views_this_month
  FROM public.listing_views 
  WHERE listing_views.listing_id = listing_id_param 
    AND viewed_at >= month_ago;
  
  -- Get daily views for the last 30 days
  WITH date_series AS (
    SELECT generate_series(
      date_trunc('day', now() - interval '29 days'),
      date_trunc('day', now()),
      interval '1 day'
    )::date AS date
  ),
  daily_counts AS (
    SELECT 
      date_trunc('day', viewed_at)::date AS date,
      count(*) AS views
    FROM public.listing_views
    WHERE listing_views.listing_id = listing_id_param
      AND viewed_at >= now() - interval '30 days'
    GROUP BY date_trunc('day', viewed_at)::date
  )
  SELECT json_agg(
    json_build_object(
      'date', ds.date,
      'views', COALESCE(dc.views, 0)
    ) ORDER BY ds.date
  ) INTO daily_views
  FROM date_series ds
  LEFT JOIN daily_counts dc ON ds.date = dc.date;
  
  RETURN QUERY SELECT 
    get_listing_analytics.total_views,
    get_listing_analytics.unique_viewers,
    get_listing_analytics.views_this_week,
    get_listing_analytics.views_this_month,
    get_listing_analytics.daily_views;
END;
$$;

-- Create function to get agent dashboard analytics
CREATE OR REPLACE FUNCTION public.get_agent_dashboard_analytics(agent_user_id uuid)
RETURNS TABLE(
  total_listings bigint,
  active_listings bigint,
  total_views bigint,
  total_inquiries bigint,
  listings_this_month bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  month_ago timestamptz := now() - interval '30 days';
BEGIN
  -- Get total listings
  SELECT count(*) INTO total_listings
  FROM public.property_listings 
  WHERE user_id = agent_user_id;
  
  -- Get active listings
  SELECT count(*) INTO active_listings
  FROM public.property_listings 
  WHERE user_id = agent_user_id 
    AND status = 'active';
  
  -- Get total views across all listings
  SELECT count(*) INTO total_views
  FROM public.listing_views lv
  JOIN public.property_listings pl ON lv.listing_id = pl.id
  WHERE pl.user_id = agent_user_id;
  
  -- For now, set inquiries to 0 (can be enhanced later with an inquiries table)
  total_inquiries := 0;
  
  -- Get listings created this month
  SELECT count(*) INTO listings_this_month
  FROM public.property_listings 
  WHERE user_id = agent_user_id 
    AND created_at >= month_ago;
  
  RETURN QUERY SELECT 
    get_agent_dashboard_analytics.total_listings,
    get_agent_dashboard_analytics.active_listings,
    get_agent_dashboard_analytics.total_views,
    get_agent_dashboard_analytics.total_inquiries,
    get_agent_dashboard_analytics.listings_this_month;
END;
$$;

-- Update RLS policies for auction_listings to ensure all auctions are visible
DROP POLICY IF EXISTS "Anyone can view active auctions" ON public.auction_listings;

CREATE POLICY "Anyone can view all auctions" 
ON public.auction_listings 
FOR SELECT 
USING (true);

-- Create some sample auction data based on existing listings
INSERT INTO public.auction_listings (
  user_id,
  property_listing_id,
  starting_bid,
  current_bid,
  auction_end_time,
  status
)
SELECT 
  user_id,
  id,
  price * 0.8, -- Starting bid is 80% of listing price
  price * 0.8, -- Current bid starts at starting bid
  now() + interval '7 days', -- Auction ends in 7 days
  'active'
FROM public.property_listings 
WHERE status = 'active' 
  AND listing_purpose = 'sale'
  AND NOT EXISTS (
    SELECT 1 FROM public.auction_listings 
    WHERE property_listing_id = property_listings.id
  )
LIMIT 5;