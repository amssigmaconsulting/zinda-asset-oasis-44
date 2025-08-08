import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Calendar, Gauge, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoveButton } from "@/components/LoveButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Listing = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
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
        <div className="absolute top-4 left-4">
          <Badge variant="default">
            {isAutomobile ? "Automobile" : "Real Estate"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <LoveButton 
            listingId={listing.id} 
            className="bg-white/80 hover:bg-white"
          />
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <span className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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

const Listings = () => {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const isAutomobile = (propertyType: string) => ['sedan', 'suv', 'truck', 'coupe', 'convertible', 'hatchback', 'wagon', 'motorcycle'].includes(propertyType);
  const isRealEstate = (propertyType: string) => ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'].includes(propertyType);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        setAllListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const listingType = isAutomobile(listing.property_type) ? "Automobile" : isRealEstate(listing.property_type) ? "Real Estate" : "Other";
    const matchesType = filterType === "all" || listingType === filterType;
    const matchesCategory = filterCategory === "all" || listing.property_type === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              All Listings
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse through our complete collection of properties and vehicles. Find your perfect investment opportunity.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-lg p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Automobile">Automobile</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Luxury Sedan">Luxury Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sports Car">Sports Car</SelectItem>
                    <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredListings.length} of {allListings.length} listings
            </p>
          </div>
          
          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No listings found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Listings;