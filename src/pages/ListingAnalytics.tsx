import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Calendar, MapPin, DollarSign, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Listing {
  id: string;
  title: string;
  description: string;
  property_type: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  listing_purpose: string;
  created_at: string;
}

interface ViewData {
  total_views: number;
  unique_viewers: number;
  views_this_week: number;
  views_this_month: number;
  daily_views: { date: string; views: number }[];
}

const ListingAnalytics = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [viewData, setViewData] = useState<ViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchListingData();
    }
  }, [id]);

  const fetchListingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view analytics",
          variant: "destructive",
        });
        navigate('/sell');
        return;
      }

      // Fetch listing details
      const { data: listingData, error: listingError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (listingError) {
        toast({
          title: "Error",
          description: "Failed to load listing or you don't have access to this listing",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setListing(listingData);

      // Fetch real analytics data using the database function
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_listing_analytics', { listing_id_param: id });

      let processedViewData: ViewData;

      if (analyticsError || !analyticsData || analyticsData.length === 0) {
        console.error('Error fetching analytics data:', analyticsError);
        // Fall back to empty data if there's an error
        processedViewData = {
          total_views: 0,
          unique_viewers: 0,
          views_this_week: 0,
          views_this_month: 0,
          daily_views: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: 0
          })).reverse()
        };
      } else {
        const result = analyticsData[0];
        // Parse the daily_views JSON string if it exists
        let parsedDailyViews = [];
        try {
          if (result.daily_views && typeof result.daily_views === 'string') {
            parsedDailyViews = JSON.parse(result.daily_views);
          } else if (Array.isArray(result.daily_views)) {
            parsedDailyViews = result.daily_views;
          }
        } catch (error) {
          console.error('Error parsing daily_views:', error);
          parsedDailyViews = [];
        }

        processedViewData = {
          total_views: Number(result.total_views),
          unique_viewers: Number(result.unique_viewers),
          views_this_week: Number(result.views_this_week),
          views_this_month: Number(result.views_this_month),
          daily_views: parsedDailyViews || []
        };
      }

      setViewData(processedViewData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching listing data:', error);
      toast({
        title: "Error",
        description: "Failed to load listing analytics",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing || !viewData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Listing not found</h2>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Views",
      value: viewData.total_views.toString(),
      icon: Eye,
      description: "All-time views"
    },
    {
      title: "Unique Viewers",
      value: viewData.unique_viewers.toString(),
      icon: TrendingUp,
      description: "Different users who viewed"
    },
    {
      title: "Views This Week",
      value: viewData.views_this_week.toString(),
      icon: Calendar,
      description: "Last 7 days"
    },
    {
      title: "Views This Month",
      value: viewData.views_this_month.toString(),
      icon: Calendar,
      description: "Last 30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Listing Analytics</h1>
              <p className="text-muted-foreground">View performance metrics for your listing</p>
            </div>
          </div>
        </div>

        {/* Listing Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {listing.images.length > 0 ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">No image</div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">{listing.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ₦{listing.price.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                    {listing.status}
                  </Badge>
                  <Badge variant="outline">
                    {listing.listing_purpose === "sale" ? "For Sale" : listing.listing_purpose === "rent" ? "For Rent" : "For Auction"}
                  </Badge>
                  <Badge variant="outline">
                    {listing.property_type}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views (Last 30 Days)</CardTitle>
            <CardDescription>Track how many people view your listing each day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {viewData.daily_views.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(5, (day.views / Math.max(1, Math.max(...viewData.daily_views.map(d => d.views)))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{day.views}</span>
                  </div>
                </div>
              ))}
            </div>
            {viewData.total_views === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No views yet. Share your listing to get more visibility!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild>
            <Link to={`/edit-listing/${id}`}>Edit Listing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/listing/${id}`}>View Listing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingAnalytics;