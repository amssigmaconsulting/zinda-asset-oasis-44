import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Car, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AuctionListing {
  id: string;
  current_bid: number;
  auction_end_time: string;
  total_bids: number;
  property_listing: {
    id: string;
    title: string;
    location: string;
    property_type: string;
    images: string[];
    description: string | null;
    make?: string;
    model?: string;
    year?: number;
  };
  user_type: 'seller' | 'agent' | 'asset_company';
}

const Auction = () => {
  const [auctionListings, setAuctionListings] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctionListings();
  }, []);

  const fetchAuctionListings = async () => {
    try {
      setLoading(true);

      // Fetch auction listings with property details and user type information
      const { data: auctionData, error } = await supabase
        .from('auction_listings')
        .select(`
          id,
          current_bid,
          auction_end_time,
          total_bids,
          user_id,
          property_listing:property_listings!property_listing_id (
            id,
            title,
            location,
            property_type,
            images,
            description,
            make,
            model,
            year,
            user_id
          )
        `)
        .eq('status', 'active')
        .gt('auction_end_time', new Date().toISOString())
        .order('auction_end_time', { ascending: true });

      if (error) {
        console.error('Error fetching auction listings:', error);
        return;
      }

      if (!auctionData) return;

      // Get user IDs to determine user types
      const userIds = auctionData.map(auction => auction.property_listing?.user_id).filter(Boolean);
      
      // Check which users are agents
      const { data: agentProfiles } = await supabase
        .from('agent_profiles')
        .select('user_id')
        .in('user_id', userIds);

      const agentUserIds = agentProfiles?.map(profile => profile.user_id) || [];

      // Filter and enhance auction data with user type information
      const enhancedAuctions: AuctionListing[] = auctionData
        .filter(auction => auction.property_listing) // Only include auctions with valid property listings
        .map(auction => {
          const isAgent = agentUserIds.includes(auction.property_listing!.user_id);
          // For now, treat non-agents as sellers (could be enhanced later for asset companies)
          const userType = isAgent ? 'agent' : 'seller';

          return {
            id: auction.id,
            current_bid: auction.current_bid,
            auction_end_time: auction.auction_end_time,
            total_bids: auction.total_bids,
            property_listing: auction.property_listing!,
            user_type: userType as 'seller' | 'agent' | 'asset_company'
          };
        });

      setAuctionListings(enhancedAuctions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const getPropertyType = (listing: AuctionListing['property_listing']) => {
    if (listing.property_type === 'automobile') {
      return {
        type: 'car' as const,
        icon: Car,
        label: `${listing.year} ${listing.make} ${listing.model}`.trim() || 'Car'
      };
    }
    return {
      type: 'property' as const,
      icon: Home,
      label: 'Property'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading auctions...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Live Auctions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bid on quality cars and properties from verified sellers and agents.
          </p>
        </div>

        {auctionListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No active auctions at the moment.</p>
            <p className="text-muted-foreground text-sm mt-2">Check back later for new listings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctionListings.map((auction) => {
              const propertyInfo = getPropertyType(auction.property_listing);
              const timeLeft = getTimeLeft(auction.auction_end_time);
              const displayImage = auction.property_listing.images?.[0] || '/placeholder.svg';
              
              return (
                <Card key={auction.id} className="hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={auction.property_listing.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                    >
                      <propertyInfo.icon className="w-3 h-3 mr-1" />
                      {propertyInfo.label}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm"
                    >
                      {auction.user_type === 'agent' ? 'Agent' : 'Seller'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{auction.property_listing.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {auction.property_listing.location}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {auction.property_listing.description || 'No description available'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Bid</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(auction.current_bid)}</p>
                        <p className="text-xs text-muted-foreground">{auction.total_bids} bid(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Time Left
                        </p>
                        <p className={`font-semibold ${timeLeft === 'Ended' ? 'text-muted-foreground' : 'text-destructive'}`}>
                          {timeLeft}
                        </p>
                      </div>
                    </div>

                    <Button asChild className="w-full" variant="hero" disabled={timeLeft === 'Ended'}>
                      <Link to={`/bidding/${auction.id}`}>
                        {timeLeft === 'Ended' ? 'Auction Ended' : 'Place Bid'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Auction;