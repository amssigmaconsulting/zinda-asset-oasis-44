import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Heart, Share2, Phone, Mail, Calendar, Check, Car, Wifi, Dumbbell, Shield } from "lucide-react";

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock rental data - in real app this would come from an API
  const rentals = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main Street, City Center",
      price: 1500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 900,
      type: "Apartment",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      amenities: ["Gym", "Pool", "Parking", "Pet Friendly", "In-unit Laundry", "Air Conditioning", "WiFi", "24/7 Security"],
      available: "Available Now",
      description: "Beautiful modern apartment in the heart of downtown. Features updated kitchen with stainless steel appliances, hardwood floors throughout, and large windows with city views. Walking distance to restaurants, shopping, and public transportation.",
      lease: "12 months minimum",
      deposit: 1500,
      utilities: "Water and Trash included",
      petPolicy: "Cats and Dogs allowed with deposit",
      landlord: {
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah@rentals.com",
        company: "Downtown Properties"
      }
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
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      amenities: ["Concierge", "Rooftop", "Gym", "In-unit Laundry", "Swimming Pool", "Valet Parking", "WiFi"],
      available: "Available Dec 1st",
      description: "Luxury condo with stunning city views from floor-to-ceiling windows. Modern kitchen with granite countertops, spa-like bathroom, and premium finishes throughout. Building amenities include rooftop deck, fitness center, and 24/7 concierge.",
      lease: "12 months minimum",
      deposit: 2200,
      utilities: "All utilities included",
      petPolicy: "No pets allowed",
      landlord: {
        name: "Michael Chen",
        phone: "+1 (555) 987-6543",
        email: "michael@luxuryrentals.com",
        company: "Luxury Living Properties"
      }
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
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      amenities: ["Garden", "Garage", "Fireplace", "Pet Friendly", "Backyard", "Storage", "Laundry Room"],
      available: "Available Now",
      description: "Perfect family home with spacious rooms and beautiful garden. Features include updated kitchen, cozy fireplace in living room, master suite with walk-in closet, and large backyard perfect for entertaining.",
      lease: "12 months minimum",
      deposit: 2800,
      utilities: "Tenant responsible for all utilities",
      petPolicy: "Pets welcome with additional deposit",
      landlord: {
        name: "David Williams",
        phone: "+1 (555) 456-7890",
        email: "david@familyhomes.com",
        company: "Family Home Rentals"
      }
    }
  ];

  const rental = rentals.find(r => r.id === parseInt(id || "0"));

  if (!rental) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Rental Property Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The rental property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/rental-results")}>
              Back to Rental Results
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      "Gym": Dumbbell,
      "WiFi": Wifi,
      "Parking": Car,
      "24/7 Security": Shield,
      "Pool": "🏊",
      "Pet Friendly": "🐕",
      "In-unit Laundry": "🧺",
      "Air Conditioning": "❄️",
      "Concierge": "🏨",
      "Rooftop": "🏢",
      "Swimming Pool": "🏊",
      "Valet Parking": Car,
      "Garden": "🌳",
      "Garage": Car,
      "Fireplace": "🔥",
      "Backyard": "🌿",
      "Storage": "📦",
      "Laundry Room": "🧺"
    };
    
    const IconComponent = iconMap[amenity];
    if (typeof IconComponent === "string") {
      return <span className="text-lg">{IconComponent}</span>;
    }
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Check className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-[152px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"></div>
                  <div className="h-[152px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{rental.title}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {rental.address}
                  </p>
                </div>
                <Badge className="bg-green-600 hover:bg-green-600">
                  {rental.available}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                {rental.bedrooms > 0 ? (
                  <span className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    {rental.bedrooms} Bedrooms
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    Studio
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  {rental.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-2">
                  <Maximize className="h-4 w-4" />
                  {rental.sqft} sq ft
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-primary">${rental.price}</span>
                <span className="text-xl text-muted-foreground ml-2">/month</span>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {rental.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rental.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lease Details */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Lease Term</p>
                    <p className="text-muted-foreground">{rental.lease}</p>
                  </div>
                  <div>
                    <p className="font-medium">Security Deposit</p>
                    <p className="text-muted-foreground">${rental.deposit}</p>
                  </div>
                  <div>
                    <p className="font-medium">Utilities</p>
                    <p className="text-muted-foreground">{rental.utilities}</p>
                  </div>
                  <div>
                    <p className="font-medium">Pet Policy</p>
                    <p className="text-muted-foreground">{rental.petPolicy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Landlord */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
                <CardDescription>Get in touch to schedule a viewing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{rental.landlord.name}</p>
                  <p className="text-sm text-muted-foreground">{rental.landlord.company}</p>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {rental.landlord.phone}
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Tour
                  </Button>
                  
                  <Button variant="ghost" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Details */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{rental.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-medium">${rental.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{rental.sqft} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {rental.available}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RentalDetails;