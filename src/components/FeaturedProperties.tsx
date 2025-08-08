import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Calendar, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoveButton } from "@/components/LoveButton";

type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_purpose: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year?: number;
  mileage?: string;
  fuel_type?: string;
  condition?: string;
  make?: string;
  model?: string;
  images: string[];
  created_at: string;
};

const ListingCard = ({ listing }: { listing: Listing }) => {
  const isAutomobile = ['sedan', 'suv', 'truck', 'coupe', 'convertible', 'hatchback', 'wagon', 'motorcycle'].includes(listing.property_type);
  const isRealEstate = ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'].includes(listing.property_type);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 space-y-2">
          <Badge variant="default">
            {isAutomobile ? "Automobile" : isRealEstate ? "Real Estate" : listing.property_type}
          </Badge>
          <div>
            <Badge variant="secondary" className="capitalize">
              {listing.listing_purpose === 'sale' ? 'For Sale' : 
               listing.listing_purpose === 'rent' ? 'For Rent' : 
               listing.listing_purpose === 'auction' ? 'Auction' : listing.listing_purpose}
            </Badge>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <LoveButton 
            listingId={listing.id} 
            className="bg-white/80 hover:bg-white"
          />
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
            {listing.title}
          </h3>
          <span className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(listing.price)}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.location}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-4">
          {isAutomobile ? (
            <>
              {listing.year && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{listing.year}</span>
                </div>
              )}
              {listing.mileage && (
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1" />
                  <span>{listing.mileage}</span>
                </div>
              )}
            </>
          ) : (
            <>
              {listing.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{listing.bedrooms} beds</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{listing.bathrooms} baths</span>
                </div>
              )}
              {listing.square_feet && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{listing.square_feet} sqft</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <Button asChild className="w-full" variant="outline">
          <Link to={`/listing/${listing.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const FeaturedProperties = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Listings</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading featured listings...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Featured Listings</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of quality properties and vehicles 
            for sale, rent, and auction.
          </p>
        </div>
        
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No listings available at the moment.</p>
          </div>
        )}
        
        <div className="text-center">
          <Button asChild variant="accent" size="lg">
            <Link to="/listings">View All Listings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;