import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Target,
  Award,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AffiliateMarketing = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "High Commission Rates",
      description: "Earn up to 15% commission on every successful referral"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Growing Network",
      description: "Join thousands of affiliates already earning with Zinda"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Quality Leads",
      description: "Access to pre-qualified leads in real estate and automobiles"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Recognition Program",
      description: "Top performers get special recognition and bonus rewards"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your affiliate account and get approved"
    },
    {
      step: "2", 
      title: "Promote",
      description: "Share your unique referral links and promote Zinda"
    },
    {
      step: "3",
      title: "Earn",
      description: "Get paid commissions for every successful referral"
    }
  ];

  const stats = [
    { label: "Active Affiliates", value: "2,500+" },
    { label: "Total Commissions Paid", value: "₦50M+" },
    { label: "Average Monthly Earnings", value: "₦150K" },
    { label: "Success Rate", value: "85%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Our <span className="text-yellow-300">Affiliate Program</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Partner with Zinda and earn substantial commissions by referring customers to our marketplace
          </p>
          <Button size="lg" variant="accent" className="text-lg px-8 py-3" asChild>
            <Link to="/start-earning">
              <Globe className="h-5 w-5 mr-2" />
              Start Earning Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Affiliate Program?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join the most rewarding affiliate program in the Nigerian real estate and automobile market
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Getting started is simple and straightforward
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Commission Structure</h2>
            <p className="text-lg text-muted-foreground">
              Competitive rates that reward your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="w-fit mx-auto">Starter</Badge>
                <CardTitle className="text-2xl mt-4">5%</CardTitle>
                <p className="text-muted-foreground">Commission Rate</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    0-10 referrals/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Basic support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Marketing materials
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-primary">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
              <CardHeader className="text-center">
                <Badge className="w-fit mx-auto">Professional</Badge>
                <CardTitle className="text-2xl mt-4">10%</CardTitle>
                <p className="text-muted-foreground">Commission Rate</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    11-25 referrals/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Advanced analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="text-center">
                <Badge variant="secondary" className="w-fit mx-auto">Elite</Badge>
                <CardTitle className="text-2xl mt-4">15%</CardTitle>
                <p className="text-muted-foreground">Commission Rate</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    25+ referrals/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dedicated manager
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom solutions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our affiliate program today and start earning commissions from day one
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="accent" className="text-lg px-8 py-3" asChild>
              <Link to="/start-earning">
                <TrendingUp className="h-5 w-5 mr-2" />
                Apply Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              <Star className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AffiliateMarketing;