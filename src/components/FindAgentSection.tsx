import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FindAgentSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Need Professional Help?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified agents and inspectors who can guide you through your investment journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-6 sm:mb-8">
          <Card className="text-center group hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Real Estate Experts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Certified agents and property managers ready to assist
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Verified Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All agents are background-checked and verified
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Quick Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get matched with the right professional instantly
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="hero"
            onClick={() => navigate('/find-agent')}
            className="px-8 py-3"
          >
            Find an Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FindAgentSection;