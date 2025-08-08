import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Globe, Award, Target, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            About Zinda
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Zinda is a revolutionary marketplace platform that connects buyers, sellers, and renters 
            across multiple asset categories including real estate, automobiles, and more. We're 
            transforming how people discover, transact, and invest in valuable assets.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to valuable assets by creating a transparent, efficient, 
                and secure marketplace that empowers individuals and businesses to make informed 
                decisions about their investments and transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the world's most trusted and comprehensive asset marketplace, 
                where every transaction is seamless, every listing is verified, and every 
                user experience exceeds expectations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Real Estate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Buy, sell, or rent residential and commercial properties with confidence. 
                  Our platform features detailed listings, virtual tours, and expert guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Automobiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover your next vehicle from our extensive collection of cars, motorcycles, 
                  and commercial vehicles. Every listing includes comprehensive inspection reports.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Auctions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Participate in live auctions for unique and valuable assets. Our transparent 
                  bidding system ensures fair competition and authentic transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Stats */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Zinda by the Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Active Listings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100K+</div>
                <div className="text-muted-foreground">Registered Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$2B+</div>
                <div className="text-muted-foreground">Transactions Facilitated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Zinda */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Zinda?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Verified Listings</h3>
                  <p className="text-muted-foreground text-sm">
                    Every property and vehicle undergoes thorough verification to ensure authenticity and accuracy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Global Reach</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with buyers and sellers from around the world through our international platform.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Expert Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Our team of specialists provides guidance throughout your buying, selling, or renting journey.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Transactions</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced security measures and escrow services protect your investments and personal information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Smart Matching</h3>
                  <p className="text-muted-foreground text-sm">
                    AI-powered algorithms help match you with the perfect properties and vehicles based on your preferences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Customer First</h3>
                  <p className="text-muted-foreground text-sm">
                    Your satisfaction is our priority, with 24/7 support and transparent communication throughout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Built with Cutting-Edge Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="text-sm">AI-Powered Search</Badge>
              <Badge variant="secondary" className="text-sm">Blockchain Security</Badge>
              <Badge variant="secondary" className="text-sm">Real-Time Analytics</Badge>
              <Badge variant="secondary" className="text-sm">Mobile Optimization</Badge>
              <Badge variant="secondary" className="text-sm">Cloud Infrastructure</Badge>
              <Badge variant="secondary" className="text-sm">Advanced Encryption</Badge>
              <Badge variant="secondary" className="text-sm">Machine Learning</Badge>
              <Badge variant="secondary" className="text-sm">API Integration</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;