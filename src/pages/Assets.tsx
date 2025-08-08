import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Bath, Square, Calendar, Gauge, Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  listing_purpose: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year?: number;
  mileage?: string;
  make?: string;
  model?: string;
  fuel_type?: string;
  created_at: string;
}

const AssetCard = ({ asset }: { asset: Asset }) => {
  const isRealEstate = asset.property_type !== 'automobile';
  const image = asset.images && asset.images.length > 0 ? asset.images[0] : "/placeholder.svg";
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={asset.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground capitalize">
          {asset.listing_purpose}
        </Badge>
        <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground capitalize">
          {asset.property_type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {asset.title}
        </h3>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{asset.location}</span>
        </div>
        
        {isRealEstate && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            {asset.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{asset.bedrooms} beds</span>
              </div>
            )}
            {asset.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{asset.bathrooms} baths</span>
              </div>
            )}
            {asset.square_feet && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{asset.square_feet} sqft</span>
              </div>
            )}
          </div>
        )}
        
        {!isRealEstate && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            {asset.year && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{asset.year}</span>
              </div>
            )}
            {asset.mileage && (
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-1" />
                <span>{asset.mileage} mi</span>
              </div>
            )}
            {(asset.make || asset.model) && (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
                <span>{asset.make} {asset.model}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${asset.price.toLocaleString()}
          </span>
          <Button size="sm" asChild>
            <Link to={isRealEstate ? `/listing/${asset.id}` : `/automobile/${asset.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || 
                       (typeFilter === "real-estate" && asset.property_type !== 'automobile') ||
                       (typeFilter === "automobile" && asset.property_type === 'automobile');
    const matchesPurpose = purposeFilter === "all" || asset.listing_purpose === purposeFilter;
    
    return matchesSearch && matchesType && matchesPurpose;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPurposeFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Loading Assets...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">All Assets</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of real estate properties and automobiles
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="automobile">Automobiles</SelectItem>
              </SelectContent>
            </Select>
            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Listing Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Purposes</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAssets.length} of {assets.length} assets
          </p>
        </div>

        {/* Assets grid */}
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No assets found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clear the filters
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Assets;