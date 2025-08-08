import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Gavel, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const auctionSchema = z.object({
  property_listing_id: z.string().min(1, "Please select a listing"),
  starting_bid: z.string().min(1, "Starting bid is required"),
  bid_increment: z.string().min(1, "Bid increment is required"),
  auction_end_time: z.string().min(1, "End time is required"),
});

type AuctionFormData = z.infer<typeof auctionSchema>;

interface UserListing {
  id: string;
  title: string;
  property_type: string;
  price: number;
  location: string;
  status: string;
}

const CreateAuction = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues: {
      property_listing_id: "",
      starting_bid: "",
      bid_increment: "1000",
      auction_end_time: "",
    },
  });

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create auctions",
          variant: "destructive",
        });
        navigate('/sell');
        return;
      }

      // Fetch user's active listings that aren't already in auction
      const { data: listings, error } = await supabase
        .from('property_listings')
        .select(`
          id,
          title,
          property_type,
          price,
          location,
          status
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .not('id', 'in', `(
          SELECT property_listing_id 
          FROM auction_listings 
          WHERE status = 'active' 
          AND property_listing_id IS NOT NULL
        )`);

      if (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Error",
          description: "Failed to load your listings",
          variant: "destructive",
        });
      } else {
        setUserListings(listings || []);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AuctionFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create auctions",
          variant: "destructive",
        });
        navigate("/sell");
        return;
      }

      // Validate end time is in the future
      const endTime = new Date(data.auction_end_time);
      const now = new Date();
      
      if (endTime <= now) {
        toast({
          title: "Invalid End Time",
          description: "Auction end time must be in the future",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Ensure minimum auction duration (1 hour)
      const minEndTime = new Date(now.getTime() + 60 * 60 * 1000);
      if (endTime < minEndTime) {
        toast({
          title: "Invalid Duration",
          description: "Auction must run for at least 1 hour",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const startingBid = parseFloat(data.starting_bid.replace(/[^0-9.]/g, ''));
      const bidIncrement = parseFloat(data.bid_increment.replace(/[^0-9.]/g, ''));

      // Create the auction
      const { error } = await supabase
        .from('auction_listings')
        .insert({
          user_id: user.id,
          property_listing_id: data.property_listing_id,
          starting_bid: startingBid,
          current_bid: startingBid,
          bid_increment: bidIncrement,
          auction_end_time: endTime.toISOString(),
          status: 'active'
        });

      if (error) {
        console.error('Error creating auction:', error);
        toast({
          title: "Error Creating Auction",
          description: "There was an error creating your auction. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Auction Created Successfully!",
        description: "Your auction is now live and accepting bids.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error creating auction:', error);
      toast({
        title: "Error Creating Auction",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate default end time (7 days from now)
  const getDefaultEndTime = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 16);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading your listings...</div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Gavel className="h-8 w-8 mr-3" />
                Create Auction
              </h1>
              <p className="text-muted-foreground mt-1">Put your property up for auction</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {userListings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Eligible Listings</h3>
                <p className="text-muted-foreground mb-4">
                  You need to have active listings before you can create auctions.
                </p>
                <Button asChild>
                  <Link to="/create-listing">Create a Listing First</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Auction Details</CardTitle>
                    <CardDescription>
                      Set up your auction parameters and schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="property_listing_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Listing to Auction</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a listing from your active properties" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userListings.map((listing) => (
                                <SelectItem key={listing.id} value={listing.id}>
                                  <div className="flex flex-col">
                                    <span>{listing.title}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {listing.property_type} • {listing.location} • ${listing.price.toLocaleString()}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Only your active listings that aren't already in auction are shown
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="starting_bid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Starting Bid ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="50000" {...field} />
                            </FormControl>
                            <FormDescription>
                              The minimum bid to start the auction
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bid_increment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bid Increment ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="1000" {...field} />
                            </FormControl>
                            <FormDescription>
                              Minimum amount each bid must increase
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="auction_end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auction End Time</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              min={new Date().toISOString().slice(0, 16)}
                              placeholder={getDefaultEndTime()}
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            When the auction will end and the highest bidder wins
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Auction
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;