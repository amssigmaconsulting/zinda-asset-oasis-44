import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Home, Bed, Users, Bath, Maximize, Heart, Eye } from "lucide-react";

const RentalResults = () => {
  const [searchParams] = useSearchParams();
  
  // Get search criteria from URL parameters
  const location = searchParams.get("location") || "Any Location";
  const budget = searchParams.get("budget") || "Any Budget";
  const propertyType = searchParams.get("propertyType") || "Any Type";
  const bedrooms = searchParams.get("bedrooms") || "Any Bedrooms";

  // Mock rental data based on search criteria
  const [rentals] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main Street, City Center",
      price: 1500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 900,
      type: "Apartment",
      image: "/placeholder.svg",
      amenities: ["Gym", "Pool", "Parking", "Pet Friendly"],
      available: "Available Now"
    },
    {
      id: 2,
      title: "Luxury Condo with City View",
      address: "456 High Street, Downtown",
      price: 2200,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      type: "Condo",
      image: "/placeholder.svg",
      amenities: ["Concierge", "Rooftop", "Gym", "In-unit Laundry"],
      available: "Available Dec 1st"
    },
    {
      id: 3,
      title: "Spacious Family House",
      address: "789 Oak Avenue, Suburbs",
      price: 2800,
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      type: "House",
      image: "/placeholder.svg",
      amenities: ["Garden", "Garage", "Fireplace", "Pet Friendly"],
      available: "Available Now"
    },
    {
      id: 4,
      title: "Cozy Studio Near Campus",
      address: "321 University Drive, Campus Area",
      price: 950,
      bedrooms: 0,
      bathrooms: 1,
      sqft: 450,
      type: "Studio",
      image: "/placeholder.svg",
      amenities: ["Furnished", "Utilities Included", "WiFi"],
      available: "Available Jan 1st"
    },
    {
      id: 5,
      title: "Modern Loft in Arts District",
      address: "654 Creative Street, Arts Quarter",
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      type: "Apartment",
      image: "/placeholder.svg",
      amenities: ["High Ceilings", "Exposed Brick", "Artist Studio"],
      available: "Available Now"
    },
    {
      id: 6,
      title: "Elegant Townhouse",
      address: "987 Elm Street, Historic District",
      price: 3200,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2000,
      type: "House",
      image: "/placeholder.svg",
      amenities: ["Historic Character", "Private Patio", "Parking"],
      available: "Available Feb 1st"
    }
  ]);

  const formatBudget = (budget: string) => {
    if (budget === "Any Budget") return budget;
    if (budget === "0-1000") return "$0 - $1,000";
    if (budget === "1000-2000") return "$1,000 - $2,000";
    if (budget === "2000-3000") return "$2,000 - $3,000";
    if (budget === "3000+") return "$3,000+";
    return budget;
  };

  const formatPropertyType = (type: string) => {
    if (type === "Any Type") return type;
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatBedrooms = (bedrooms: string) => {
    if (bedrooms === "Any Bedrooms") return bedrooms;
    if (bedrooms === "studio") return "Studio";
    if (bedrooms === "1") return "1 Bedroom";
    if (bedrooms === "2") return "2 Bedrooms";
    if (bedrooms === "3") return "3+ Bedrooms";
    return bedrooms;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Rental Search Results</h1>
          <p className="text-muted-foreground mb-6">
            Found {rentals.length} properties matching your criteria
          </p>
          
          {/* Search Criteria Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Search Criteria</CardTitle>
              <CardDescription>Your selected filters and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-muted-foreground">{formatBudget(budget)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Property Type</p>
                    <p className="text-sm text-muted-foreground">{formatPropertyType(propertyType)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Bedrooms</p>
                    <p className="text-sm text-muted-foreground">{formatBedrooms(bedrooms)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute bottom-2 left-2 bg-green-600 hover:bg-green-600">
                  {rental.available}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{rental.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {rental.address}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {rental.bedrooms > 0 ? (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {rental.bedrooms} bed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Studio
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {rental.bathrooms} bath
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3 w-3" />
                    {rental.sqft} sq ft
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {rental.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {rental.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{rental.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-primary">${rental.price}</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  <Badge variant="outline">{rental.type}</Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/rental/${rental.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button className="flex-1">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RentalResults;