import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Heart, Calendar, Gauge, Search as SearchIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const allListings = [
  {
    id: 1,
    title: "Luxury Downtown Penthouse",
    price: "₦980,000,000",
    location: "Manhattan, New York",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    type: "Real Estate",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "2023 Mercedes-Benz S-Class",
    price: "₦185,000,000",
    location: "Beverly Hills, CA",
    beds: null,
    baths: null,
    sqft: null,
    type: "Automobile",
    category: "Luxury Sedan",
    specs: { year: 2023, mileage: "8,500 miles", engine: "V6 Turbo" },
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: 3,
    title: "Waterfront Villa Estate",
    price: "₦6,300,000,000",
    location: "Malibu, California",
    beds: 5,
    baths: 4,
    sqft: "4,800",
    type: "Real Estate",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: 4,
    title: "2024 Tesla Model S Plaid",
    price: "₦200,000,000",
    location: "San Francisco, CA",
    beds: null,
    baths: null,
    sqft: null,
    type: "Automobile",
    category: "Electric Vehicle",
    specs: { year: 2024, mileage: "2,100 miles", engine: "Tri-Motor Electric" },
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
    featured: true
  },
  {
    id: 5,
    title: "Modern Office Complex",
    price: "₦13,400,000,000",
    location: "Downtown Seattle",
    beds: null,
    baths: 12,
    sqft: "15,000",
    type: "Real Estate",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    featured: false
  },
  {
    id: 6,
    title: "2022 Porsche 911 Turbo S",
    price: "₦365,000,000",
    location: "Miami, FL",
    beds: null,
    baths: null,
    sqft: null,
    type: "Automobile",
    category: "Sports Car",
    specs: { year: 2022, mileage: "12,000 miles", engine: "3.8L Twin-Turbo" },
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    featured: false
  },
  {
    id: 7,
    title: "Modern Family Home",
    price: "₦450,000,000",
    location: "Lagos, Nigeria",
    beds: 4,
    baths: 3,
    sqft: "2,800",
    type: "Real Estate",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    featured: false
  },
  {
    id: 8,
    title: "2021 BMW X5",
    price: "₦95,000,000",
    location: "Abuja, Nigeria",
    beds: null,
    baths: null,
    sqft: null,
    type: "Automobile",
    category: "SUV",
    specs: { year: 2021, mileage: "25,000 miles", engine: "3.0L Turbo" },
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    featured: false
  }
];

const ListingCard = ({ listing }: { listing: typeof allListings[0] }) => {
  const isAutomobile = listing.type === "Automobile";
  
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={listing.featured ? "default" : "secondary"}>
            {listing.featured ? "Featured" : listing.category}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <span className="text-2xl font-bold text-primary">{listing.price}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          {isAutomobile && listing.specs ? (
            <>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{listing.specs.year}</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-1" />
                <span>{listing.specs.mileage}</span>
              </div>
            </>
          ) : (
            <>
              {listing.beds && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{listing.beds} beds</span>
                </div>
              )}
              {listing.baths && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{listing.baths} baths</span>
                </div>
              )}
              {listing.sqft && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{listing.sqft} sqft</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <Button asChild className="w-full" variant="outline">
          <Link to={`/listing/${listing.id}`}>Contact Seller</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [assetType, setAssetType] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (assetType && assetType !== "all-types") params.set("type", assetType);
    if (location) params.set("location", location);
    if (category && category !== "all-categories") params.set("category", category);
    if (priceRange && priceRange !== "all-prices") params.set("price", priceRange);
    
    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Search Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Find Your Perfect Asset
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Search through our extensive collection of real estate and automobiles. Use our advanced filters to find exactly what you're looking for.
            </p>
          </div>

          {/* Main Search Interface */}
          <div className="bg-card rounded-xl p-8 shadow-elegant max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Search Term */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search by title, description, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>

              {/* Asset Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Asset Type</label>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Automobile">Automobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Luxury Sedan">Luxury Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sports Car">Sports Car</SelectItem>
                    <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-prices">All Prices</SelectItem>
                    <SelectItem value="under-75m">Under ₦75M</SelectItem>
                    <SelectItem value="75m-150m">₦75M - ₦150M</SelectItem>
                    <SelectItem value="150m-750m">₦150M - ₦750M</SelectItem>
                    <SelectItem value="750m-1.5b">₦750M - ₦1.5B</SelectItem>
                    <SelectItem value="1.5b-plus">₦1.5B+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search Assets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Search;