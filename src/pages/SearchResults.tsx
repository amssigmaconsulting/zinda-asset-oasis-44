import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Heart, Calendar, Gauge, Search as SearchIcon, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const allListings = [
  {
    id: 1,
    title: "Luxury Downtown Penthouse",
    price: "₦980,000,000",
    priceValue: 980000000,
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
    priceValue: 185000000,
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
    priceValue: 6300000000,
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
    priceValue: 200000000,
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
    priceValue: 13400000000,
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
    priceValue: 365000000,
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
    priceValue: 450000000,
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
    priceValue: 95000000,
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
        
        <div className="flex gap-2">
          <Button asChild className="flex-1" variant="outline">
            <Link to={`/listing/${listing.id}`}>View Details</Link>
          </Button>
          <Button asChild className="flex-1" variant="outline">
            <Link to={`/asset-listings/${listing.id}`}>View Listings</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link 
              to={`/related-assets/${listing.id}?${window.location.search.slice(1)}`}
            >
              Similar Assets
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [assetType, setAssetType] = useState(searchParams.get("type") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState(searchParams.get("price") || "");

  const handleNewSearch = () => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (assetType && assetType !== "all-types") newParams.set("type", assetType);
    if (location) newParams.set("location", location);
    if (category && category !== "all-categories") newParams.set("category", category);
    if (priceRange && priceRange !== "all-prices") newParams.set("price", priceRange);
    
    setSearchParams(newParams);
  };

  const getPriceFilter = (listing: typeof allListings[0], range: string) => {
    if (!range || range === "all-prices") return true;
    
    const price = listing.priceValue;
    switch (range) {
      case "under-75m":
        return price < 75000000;
      case "75m-150m":
        return price >= 75000000 && price <= 150000000;
      case "150m-750m":
        return price >= 150000000 && price <= 750000000;
      case "750m-1.5b":
        return price >= 750000000 && price <= 1500000000;
      case "1.5b-plus":
        return price > 1500000000;
      default:
        return true;
    }
  };

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch = !searchTerm || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !assetType || assetType === "all-types" || listing.type === assetType;
    const matchesLocation = !location || listing.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = !category || category === "all-categories" || listing.category === category;
    const matchesPrice = getPriceFilter(listing, priceRange);
    
    return matchesSearch && matchesType && matchesLocation && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/search" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Link>
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Search Results
            </h1>
            <p className="text-muted-foreground text-lg">
              Found {filteredListings.length} assets matching your criteria
            </p>
          </div>

          {/* Refined Search Bar */}
          <div className="bg-card rounded-xl p-6 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Search Term */}
              <div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Asset Type */}
              <div>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset type" />
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
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
              <div>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price range" />
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
              <div>
                <Button onClick={handleNewSearch} className="w-full">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Update Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No assets found matching your search criteria.</p>
              <div className="space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setAssetType("all-types");
                    setLocation("");
                    setCategory("all-categories");
                    setPriceRange("all-prices");
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  Clear All Filters
                </Button>
                <Button asChild>
                  <Link to="/search">New Search</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SearchResults;