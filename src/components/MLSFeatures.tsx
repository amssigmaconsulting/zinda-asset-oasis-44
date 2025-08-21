import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Eye, Users, BarChart3, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const MLSFeatures = () => {
  const features = [
    {
      title: "Listing Syndication",
      description: "Share your listings across multiple platforms and reach more potential buyers instantly.",
      icon: Share2,
      link: "/create-listing"
    },
    {
      title: "Advanced Analytics",
      description: "Track listing performance, market trends, and get detailed insights on your properties.",
      icon: BarChart3,
      link: "/dashboard"
    },
    {
      title: "Agent Collaboration",
      description: "Connect with other MLS members, share leads, and collaborate on transactions.",
      icon: Users,
      link: "/find-agent"
    },
    {
      title: "Market Insights",
      description: "Access comprehensive market data, comparable sales, and pricing analytics.",
      icon: Eye,
      link: "/search"
    },
    {
      title: "Secure Platform",
      description: "Bank-grade security with verified agent profiles and secure transaction handling.",
      icon: Shield,
      link: "/agent-auth"
    },
    {
      title: "Real-time Updates",
      description: "Get instant notifications on listing changes, new matches, and market updates.",
      icon: Clock,
      link: "/dashboard"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">MLS Platform Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in real estate, powered by our comprehensive MLS system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground mb-6 flex-1">
                  {feature.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={feature.link}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MLSFeatures;