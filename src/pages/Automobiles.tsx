import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Gauge, Fuel, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Automobile = {
  id: string;
  title: string;
  location: string;
  price: number;
  year?: number;
  mileage?: string;
  fuel_type?: string;
  condition?: string;
  make?: string;
  model?: string;
  property_type: string;
  images: string[];
  description?: string;
  status: string;
  created_at: string;
};

const Automobiles = () => {
  const [automobiles, setAutomobiles] = useState<Automobile[]>([]);
  const [loading, setLoading] = useState(true);

  const automobileTypes = ['sedan', 'suv', 'truck', 'coupe', 'convertible', 'hatchback', 'wagon', 'motorcycle'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchAutomobiles = async () => {
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .in('property_type', automobileTypes)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching automobiles:', error);
          return;
        }

        setAutomobiles(data || []);
      } catch (error) {
        console.error('Error fetching automobiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomobiles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Automobile Listings
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Loading automobiles...
            </p>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Automobile Listings
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your perfect car from our extensive collection of quality automobiles across Nigeria.
          </p>
        </div>

        {automobiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automobiles.map((auto) => (
              <Card key={auto.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={auto.images[0]}
                    alt={auto.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge 
                    variant={auto.condition === "new" ? "default" : "secondary"}
                    className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                  >
                    <Car className="w-3 h-3 mr-1" />
                    {auto.condition || auto.property_type}
                  </Badge>
                  {auto.fuel_type === "electric" && (
                    <Badge 
                      variant="destructive"
                      className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm hover:bg-green-700"
                    >
                      Electric
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{auto.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {auto.location}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {auto.description && (
                    <p className="text-sm text-muted-foreground">{auto.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    {auto.year && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{auto.year}</span>
                      </div>
                    )}
                    {auto.mileage && (
                      <div className="flex items-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        <span>{auto.mileage}</span>
                      </div>
                    )}
                    {auto.fuel_type && (
                      <div className="flex items-center col-span-2">
                        <Fuel className="w-4 h-4 mr-1" />
                        <span className="capitalize">{auto.fuel_type}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-2xl font-bold text-primary">{formatPrice(auto.price)}</p>
                  </div>

                  <Button asChild className="w-full" variant="hero">
                    <Link to={`/automobile/${auto.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No automobiles available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Automobiles;