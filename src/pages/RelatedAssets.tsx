import { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Heart, Calendar, Gauge, ArrowLeft, Filter } from "lucide-react";
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
  },
  {
    id: 9,
    title: "Luxury Beach House",
    price: "₦2,100,000,000",
    priceValue: 2100000000,
    location: "Malibu, California",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    type: "Real Estate",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    featured: false
  },
  {
    id: 10,
    title: "2023 Audi Q7",
    price: "₦150,000,000",
    priceValue: 150000000,
    location: "Beverly Hills, CA",
    beds: null,
    baths: null,
    sqft: null,
    type: "Automobile",
    category: "SUV",
    specs: { year: 2023, mileage: "5,200 miles", engine: "3.0L Supercharged" },
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
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
          <Link to={`/listing/${listing.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const RelatedAssets = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const assetType = searchParams.get("type") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const priceRange = searchParams.get("price") || "";

  // Find the original listing
  const originalListing = allListings.find(listing => listing.id === parseInt(id || "0"));

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

  const getSimilarAssets = () => {
    let filtered = allListings.filter(listing => {
      // Exclude the original listing
      if (listing.id === parseInt(id || "0")) return false;

      let score = 0;
      
      // Prioritize exact matches
      if (assetType && listing.type === assetType) score += 3;
      if (category && listing.category === category) score += 3;
      if (location && listing.location.toLowerCase().includes(location.toLowerCase())) score += 2;
      if (priceRange && getPriceFilter(listing, priceRange)) score += 1;

      // For loose matching, also include same type if no exact matches
      if (!assetType || assetType === "all-types") {
        if (originalListing && listing.type === originalListing.type) score += 2;
      }
      
      // Include same category if available
      if (!category || category === "all-categories") {
        if (originalListing && listing.category === originalListing.category) score += 2;
      }

      return score > 0;
    });

    // Sort by relevance score (calculated above) and return top results
    return filtered.slice(0, 8);
  };

  const relatedAssets = getSimilarAssets();

  const getActiveFilters = () => {
    const filters = [];
    if (assetType && assetType !== "all-types") filters.push(`Type: ${assetType}`);
    if (category && category !== "all-categories") filters.push(`Category: ${category}`);
    if (location) filters.push(`Location: ${location}`);
    if (priceRange && priceRange !== "all-prices") {
      const priceLabels: Record<string, string> = {
        "under-75m": "Under ₦75M",
        "75m-150m": "₦75M - ₦150M", 
        "150m-750m": "₦150M - ₦750M",
        "750m-1.5b": "₦750M - ₦1.5B",
        "1.5b-plus": "₦1.5B+"
      };
      filters.push(`Price: ${priceLabels[priceRange] || priceRange}`);
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/search-results" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search Results
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Related Assets
              </h1>
              {originalListing && (
                <Badge variant="outline" className="text-sm">
                  Similar to: {originalListing.title}
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground text-lg mb-4">
              Discover {relatedAssets.length} assets similar to your search criteria
            </p>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Original Listing Section */}
      {originalListing && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-4">Original Listing</h2>
            <div className="max-w-md">
              <ListingCard listing={originalListing} />
            </div>
          </div>
        </section>
      )}

      {/* Related Assets Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Similar Assets</h2>
            <p className="text-muted-foreground">
              Assets that match your search criteria and preferences
            </p>
          </div>
          
          {relatedAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedAssets.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No related assets found.</p>
              <div className="space-x-4">
                <Button asChild variant="outline">
                  <Link to="/search">New Search</Link>
                </Button>
                <Button asChild>
                  <Link to="/search-results">Back to Results</Link>
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

export default RelatedAssets;