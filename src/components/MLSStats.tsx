import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Building, MapPin } from "lucide-react";

const MLSStats = () => {
  const stats = [
    {
      title: "Active Listings",
      value: "25,847",
      change: "+12% this month",
      icon: Building,
      trend: "up"
    },
    {
      title: "MLS Members",
      value: "4,892",
      change: "+156 new agents",
      icon: Users,
      trend: "up"
    },
    {
      title: "Market Areas",
      value: "36",
      change: "Nationwide coverage",
      icon: MapPin,
      trend: "stable"
    },
    {
      title: "Avg. Days on Market",
      value: "28",
      change: "-5 days from last month",
      icon: TrendingUp,
      trend: "down"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">MLS Market Overview</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights from our comprehensive Multiple Listing Service platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{stat.title}</h3>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'secondary' : 'outline'}>
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MLSStats;