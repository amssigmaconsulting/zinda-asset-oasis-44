import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Users, Car, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface RentalListing {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  images: string[];
  property_type: string;
  make?: string;
  model?: string;
  year?: number;
}

const Rent = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    location: "",
    propertyType: "",
    budget: "",
    bedrooms: ""
  });
  const [rentalListings, setRentalListings] = useState<RentalListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentalListings();
  }, []);

  const fetchRentalListings = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('listing_purpose', 'rent')
        .eq('status', 'active')
        .limit(6);

      if (error) {
        console.error('Error fetching rental listings:', error);
      } else {
        setRentalListings(data || []);
      }
    } catch (error) {
      console.error('Error fetching rental listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Create URL parameters from search criteria
    const params = new URLSearchParams();
    if (searchCriteria.location) params.set("location", searchCriteria.location);
    if (searchCriteria.propertyType) params.set("propertyType", searchCriteria.propertyType);
    if (searchCriteria.budget) params.set("budget", searchCriteria.budget);
    if (searchCriteria.bedrooms) params.set("bedrooms", searchCriteria.bedrooms);
    
    // Navigate to results page with search parameters
    navigate(`/rental-results?${params.toString()}`);
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Rental</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing rental properties from apartments to luxury homes
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter city, area..." 
                    className="pl-10" 
                    value={searchCriteria.location}
                    onChange={(e) => setSearchCriteria({...searchCriteria, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={searchCriteria.propertyType} onValueChange={(value) => setSearchCriteria({...searchCriteria, propertyType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Range</label>
                <Select value={searchCriteria.budget} onValueChange={(value) => setSearchCriteria({...searchCriteria, budget: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                    <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                    <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                    <SelectItem value="3000+">$3,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <Select value={searchCriteria.bedrooms} onValueChange={(value) => setSearchCriteria({...searchCriteria, bedrooms: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="w-full mt-6" onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search Rentals
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-muted rounded animate-pulse mb-3 w-3/4"></div>
                  <div className="flex gap-4 mb-3">
                    <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse mb-3 w-24"></div>
                  <div className="h-8 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rentalListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalListings.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {property.property_type === "automobile" || property.make ? (
                        <Car className="h-12 w-12 text-muted-foreground" />
                      ) : (
                        <Home className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {property.property_type === "automobile" || property.make ? (
                      <Car className="h-3 w-3 mr-1" />
                    ) : (
                      <Home className="h-3 w-3 mr-1" />
                    )}
                    {property.property_type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {property.location}
                  </p>
                  
                  {property.make ? (
                    // Car rental details
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{property.make} {property.model}</span>
                      {property.year && <span>{property.year}</span>}
                    </div>
                  ) : (
                    // Property rental details
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {property.bedrooms && property.bedrooms > 0 ? (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {property.bedrooms} bed
                        </span>
                      ) : property.bedrooms === 0 ? (
                        <span>Studio</span>
                      ) : null}
                      {property.bathrooms && <span>{property.bathrooms} bath</span>}
                      {property.square_feet && <span>{property.square_feet} sq ft</span>}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/listing/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Home className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Rental Listings Found</h3>
              <p>There are currently no rental listings available. Check back later!</p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Rent;