import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Bed, Bath, Square, Calendar, Gauge, ArrowLeft, Phone, Mail, Share, BadgeCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LoveButton } from "@/components/LoveButton";
import { ListingLovers } from "@/components/ListingLovers";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_purpose: string;
  description?: string;
  images?: string[];
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  make?: string;
  model?: string;
  year?: number;
  mileage?: string;
  fuel_type?: string;
  condition?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AuctionListing {
  id: string;
  starting_bid: number;
  current_bid: number;
  auction_end_time: string;
  status: string;
  total_bids: number;
  bid_increment: number;
  property_listing?: Listing;
}

interface AgentProfile {
  name: string;
  email: string;
  phone?: string;
  is_verified: boolean;
}

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [auctionData, setAuctionData] = useState<AuctionListing | null>(null);
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // First, try to fetch from property_listings
        const { data: propertyListing, error: propertyError } = await supabase
          .from('property_listings')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (propertyError && propertyError.code !== 'PGRST116') {
          throw propertyError;
        }

        if (propertyListing) {
          setListing(propertyListing);

          // Check if it's an auction listing
          const { data: auctionListing } = await supabase
            .from('auction_listings')
            .select('*')
            .eq('property_listing_id', id)
            .eq('status', 'active')
            .single();

          if (auctionListing) {
            setAuctionData(auctionListing);
          }

          // Fetch agent/dealer/company profile
          const { data: agentProfile } = await supabase
            .from('agent_profiles')
            .select('name, email, phone, is_verified')
            .eq('user_id', propertyListing.user_id)
            .single();

          if (agentProfile) {
            setAgent(agentProfile);
          } else {
            // Try dealer profile
            const { data: dealerProfile } = await supabase
              .from('dealer_profiles')
              .select('contact_person, email, phone, is_verified')
              .eq('user_id', propertyListing.user_id)
              .single();

            if (dealerProfile) {
              setAgent({
                name: dealerProfile.contact_person,
                email: dealerProfile.email,
                phone: dealerProfile.phone,
                is_verified: dealerProfile.is_verified
              });
            } else {
              // Try company profile
              const { data: companyProfile } = await supabase
                .from('company_profiles')
                .select('contact_person, email, phone, is_verified')
                .eq('user_id', propertyListing.user_id)
                .single();

              if (companyProfile) {
                setAgent({
                  name: companyProfile.contact_person,
                  email: companyProfile.email,
                  phone: companyProfile.phone,
                  is_verified: companyProfile.is_verified
                });
              }
            }
          }
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Loading...</h1>
          <p className="text-muted-foreground">Fetching listing details</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The listing you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate("/listings")}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const isAutomobile = listing.property_type.toLowerCase().includes('car') || 
                      listing.property_type.toLowerCase().includes('vehicle') ||
                      listing.property_type.toLowerCase().includes('auto') ||
                      listing.make || listing.model;
  const isAuction = !!auctionData;
  const isRental = listing.listing_purpose === 'rent';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getListingTypeLabel = () => {
    if (isAuction) return "Auction";
    if (isRental) return "For Rent";
    return "For Sale";
  };

  const getMainImage = () => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    // Default image based on type
    if (isAutomobile) {
      return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop";
    }
    return "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={getMainImage()} 
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={isAuction ? "destructive" : "secondary"}>
                    {getListingTypeLabel()}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <LoveButton 
                    listingId={listing.id} 
                    className="bg-white/80 hover:bg-white"
                  />
                </div>
              </div>
              
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {listing.images.slice(1).map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`${listing.title} ${index + 2}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{listing.title}</h1>
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{listing.location}</span>
                </div>
                <p className="text-4xl font-bold text-primary mb-4">
                  {isAuction && auctionData ? 
                    `Starting: ${formatPrice(auctionData.starting_bid)} | Current: ${formatPrice(auctionData.current_bid)}` :
                    formatPrice(listing.price)
                  }
                </p>
                {isAuction && auctionData && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Auction ends: {formatDate(auctionData.auction_end_time)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total bids: {auctionData.total_bids} | Bid increment: {formatPrice(auctionData.bid_increment)}
                    </p>
                  </div>
                )}
              </div>

              {/* Property/Vehicle Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {isAutomobile ? (
                      <>
                        {listing.year && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">Year: {listing.year}</span>
                          </div>
                        )}
                        {listing.mileage && (
                          <div className="flex items-center">
                            <Gauge className="h-4 w-4 mr-2" />
                            <span className="text-sm">Mileage: {listing.mileage}</span>
                          </div>
                        )}
                        {listing.make && (
                          <div className="flex items-center">
                            <span className="text-sm">Make: {listing.make}</span>
                          </div>
                        )}
                        {listing.model && (
                          <div className="flex items-center">
                            <span className="text-sm">Model: {listing.model}</span>
                          </div>
                        )}
                        {listing.fuel_type && (
                          <div className="flex items-center">
                            <span className="text-sm">Fuel: {listing.fuel_type}</span>
                          </div>
                        )}
                        {listing.condition && (
                          <div className="flex items-center">
                            <span className="text-sm">Condition: {listing.condition}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {listing.bedrooms && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-2" />
                            <span className="text-sm">{listing.bedrooms} Bedrooms</span>
                          </div>
                        )}
                        {listing.bathrooms && (
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-2" />
                            <span className="text-sm">{listing.bathrooms} Bathrooms</span>
                          </div>
                        )}
                        {listing.square_feet && (
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-2" />
                            <span className="text-sm">{listing.square_feet} sqft</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-sm">Type: {listing.property_type}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground">{listing.description}</p>
                </CardContent>
              </Card>

              {/* Contact Agent */}
              {agent && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{agent.name}</p>
                        {agent.is_verified && (
                          <Badge variant="verified" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      {agent.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{agent.email}</span>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      {agent.phone && (
                        <Button className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      )}
                      <Button variant="outline" className={agent.phone ? "flex-1" : "flex-2"}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Listing Lovers - Only show to listing owner */}
              {user && user.id === listing.user_id && (
                <ListingLovers listingId={listing.id} />
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ListingDetails;