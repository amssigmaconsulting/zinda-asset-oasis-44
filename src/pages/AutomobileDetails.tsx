import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Gauge, Fuel, Car, Heart, Share2, Phone, Mail, Shield, CheckCircle, AlertTriangle, Settings, Wrench, BadgeCheck } from "lucide-react";

const AutomobileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock automobile data - in real app this would come from an API
  const automobiles = [
    {
      id: 1,
      title: "2020 Toyota Camry XLE",
      location: "Lagos, Nigeria",
      price: "₦8,500,000",
      year: 2020,
      mileage: "45,000 km",
      fuelType: "Petrol",
      condition: "Used",
      images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607667508292-2a8c3b5c69b7?w=400&h=300&fit=crop"
      ],
      description: "Well-maintained sedan with leather seats and navigation system. This vehicle has been serviced regularly and comes with complete maintenance records. Perfect for daily commuting and long trips.",
      features: [
        "Leather Interior",
        "Navigation System", 
        "Backup Camera",
        "Bluetooth Connectivity",
        "Cruise Control",
        "Sunroof",
        "Heated Seats",
        "Keyless Entry",
        "Lane Departure Warning",
        "Automatic Climate Control"
      ],
      specs: {
        engine: "2.5L 4-Cylinder",
        transmission: "8-Speed Automatic",
        drivetrain: "Front-Wheel Drive",
        exteriorColor: "Midnight Black",
        interiorColor: "Black Leather",
        vin: "4T1B11HK1LU123456",
        bodyType: "Sedan",
        doors: 4,
        seating: 5
      },
      seller: {
        name: "AutoMax Lagos",
        phone: "+234 803 123 4567",
        email: "sales@automaxlagos.com",
        type: "Broker",
        rating: 4.8,
        location: "Victoria Island, Lagos",
        verified: true
      },
      inspectionReport: {
        overall: "Good",
        engine: "Excellent",
        transmission: "Good",
        brakes: "Good",
        tires: "Fair - Front tires need replacement soon",
        interior: "Excellent",
        exterior: "Good - Minor scratches on rear bumper"
      }
    },
    {
      id: 2,
      title: "2019 Honda Accord Sport",
      location: "Abuja, Nigeria",
      price: "₦7,200,000",
      year: 2019,
      mileage: "62,000 km",
      fuelType: "Petrol",
      condition: "Used",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607667508292-2a8c3b5c69b7?w=400&h=300&fit=crop"
      ],
      description: "Sporty sedan with excellent sound system and sunroof. This Honda Accord Sport offers a perfect blend of performance and comfort with its turbocharged engine and sport-tuned suspension.",
      features: [
        "Sport Tuned Suspension",
        "Premium Sound System",
        "Sunroof",
        "Turbo Engine",
        "Sport Seats",
        "Apple CarPlay",
        "Android Auto",
        "Wireless Charging",
        "Adaptive Cruise Control",
        "Emergency Braking"
      ],
      specs: {
        engine: "1.5L Turbo 4-Cylinder",
        transmission: "CVT Automatic",
        drivetrain: "Front-Wheel Drive",
        exteriorColor: "Sonic Gray Pearl",
        interiorColor: "Black Sport Cloth",
        vin: "1HGCV1F13KA123456",
        bodyType: "Sedan",
        doors: 4,
        seating: 5
      },
      seller: {
        name: "Premium Cars Abuja",
        phone: "+234 809 876 5432",
        email: "info@premiumcarsabuja.com",
        type: "Broker",
        rating: 4.6,
        location: "Central Business District, Abuja",
        verified: false
      },
      inspectionReport: {
        overall: "Very Good",
        engine: "Excellent",
        transmission: "Excellent",
        brakes: "Good",
        tires: "Good",
        interior: "Very Good",
        exterior: "Very Good"
      }
    },
    {
      id: 3,
      title: "2021 Lexus ES 350",
      location: "Port Harcourt, Nigeria",
      price: "₦15,800,000",
      year: 2021,
      mileage: "28,000 km",
      fuelType: "Petrol",
      condition: "Used",
      images: [
        "https://images.unsplash.com/photo-1607667508292-2a8c3b5c69b7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
      ],
      description: "Luxury sedan with advanced safety features and quality interior. This Lexus ES 350 represents the pinnacle of luxury and reliability with its premium amenities and smooth ride quality.",
      features: [
        "Premium Leather Interior",
        "Mark Levinson Audio",
        "Panoramic Sunroof",
        "Lexus Safety System+",
        "Heated & Ventilated Seats",
        "Wireless Phone Charging",
        "Adaptive Headlights",
        "Power Rear Sunshade",
        "Premium Navigation",
        "Remote Start"
      ],
      specs: {
        engine: "3.5L V6",
        transmission: "8-Speed Automatic",
        drivetrain: "Front-Wheel Drive",
        exteriorColor: "Ultra White",
        interiorColor: "Rioja Red Leather",
        vin: "58ABK1GG6MU123456",
        bodyType: "Sedan",
        doors: 4,
        seating: 5
      },
      seller: {
        name: "Luxury Auto Gallery",
        phone: "+234 803 567 8901",
        email: "sales@luxuryautogallery.com",
        type: "Broker",
        rating: 4.9,
        location: "GRA Phase 2, Port Harcourt",
        verified: true
      },
      inspectionReport: {
        overall: "Excellent",
        engine: "Excellent",
        transmission: "Excellent",
        brakes: "Excellent",
        tires: "Good",
        interior: "Excellent",
        exterior: "Excellent"
      }
    }
  ];

  const automobile = automobiles.find(auto => auto.id === parseInt(id || "0"));

  if (!automobile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Automobile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The automobile you're looking for doesn't exist or has been sold.
            </p>
            <Button onClick={() => navigate("/automobiles")}>
              Back to Automobiles
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return "text-green-600";
      case "very good": return "text-blue-600";
      case "good": return "text-yellow-600";
      case "fair": return "text-orange-600";
      default: return "text-muted-foreground";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return <CheckCircle className="h-4 w-4" />;
      case "very good": return <CheckCircle className="h-4 w-4" />;
      case "good": return <CheckCircle className="h-4 w-4" />;
      case "fair": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
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
                  <div className="relative">
                    <img
                      src={automobile.images[0]}
                      alt={automobile.title}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Badge 
                      variant={automobile.condition === "New" ? "default" : "secondary"}
                      className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm"
                    >
                      <Car className="w-3 h-3 mr-1" />
                      {automobile.condition}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {automobile.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${automobile.title} ${index + 2}`}
                      className="w-full h-[152px] object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{automobile.title}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {automobile.location}
                  </p>
                </div>
                {automobile.fuelType === "Electric" && (
                  <Badge className="bg-green-600 hover:bg-green-600">
                    Electric Vehicle
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {automobile.year}
                </span>
                <span className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  {automobile.mileage}
                </span>
                <span className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  {automobile.fuelType}
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-primary">{automobile.price}</span>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {automobile.description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Features & Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {automobile.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Vehicle Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Engine</p>
                      <p className="text-muted-foreground">{automobile.specs.engine}</p>
                    </div>
                    <div>
                      <p className="font-medium">Transmission</p>
                      <p className="text-muted-foreground">{automobile.specs.transmission}</p>
                    </div>
                    <div>
                      <p className="font-medium">Drivetrain</p>
                      <p className="text-muted-foreground">{automobile.specs.drivetrain}</p>
                    </div>
                    <div>
                      <p className="font-medium">Body Type</p>
                      <p className="text-muted-foreground">{automobile.specs.bodyType}</p>
                    </div>
                    <div>
                      <p className="font-medium">Doors</p>
                      <p className="text-muted-foreground">{automobile.specs.doors}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Exterior Color</p>
                      <p className="text-muted-foreground">{automobile.specs.exteriorColor}</p>
                    </div>
                    <div>
                      <p className="font-medium">Interior Color</p>
                      <p className="text-muted-foreground">{automobile.specs.interiorColor}</p>
                    </div>
                    <div>
                      <p className="font-medium">VIN</p>
                      <p className="text-muted-foreground">{automobile.specs.vin}</p>
                    </div>
                    <div>
                      <p className="font-medium">Seating Capacity</p>
                      <p className="text-muted-foreground">{automobile.specs.seating} passengers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inspection Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Inspection Report
                </CardTitle>
                <CardDescription>Professional vehicle inspection assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(automobile.inspectionReport).map(([component, condition]) => (
                    <div key={component} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {component === "engine" ? <Settings className="h-4 w-4" /> : 
                         component === "transmission" ? <Settings className="h-4 w-4" /> :
                         <Wrench className="h-4 w-4" />}
                        <span className="font-medium capitalize">{component}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${getConditionColor(condition)}`}>
                        {getConditionIcon(condition)}
                        <span className="text-sm font-medium">{condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
                <CardDescription>Get in touch to schedule a test drive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{automobile.seller.name}</p>
                    {automobile.seller.verified && (
                      <div className="flex items-center gap-1">
                        <BadgeCheck className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-sm text-yellow-600 font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{automobile.seller.type}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{automobile.seller.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {automobile.seller.phone}
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Car className="h-4 w-4 mr-2" />
                    Schedule Test Drive
                  </Button>
                  
                  <Button variant="ghost" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Listing
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
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-medium">{automobile.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mileage</span>
                  <span className="font-medium">{automobile.mileage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel Type</span>
                  <span className="font-medium">{automobile.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition</span>
                  <Badge variant="outline">{automobile.condition}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-primary">{automobile.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Financing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Available</CardTitle>
                <CardDescription>Calculate your monthly payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Starting from</span>
                    <span className="font-medium">₦85,000/month*</span>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Calculate Payment
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    *Based on 60-month loan at 15% APR
                  </p>
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

export default AutomobileDetails;