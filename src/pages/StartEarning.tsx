import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Target,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const StartEarning = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    website: "",
    experience: "",
    audience: "",
    referralMethods: "",
    expectedReferrals: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally submit to your backend
    console.log("Affiliate application submitted:", formData);
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      website: "",
      experience: "",
      audience: "",
      referralMethods: "",
      expectedReferrals: "",
      additionalInfo: ""
    });
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: "Up to 15% Commission",
      description: "Earn competitive rates on every successful sale"
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Quality Support",
      description: "Get dedicated support and marketing materials"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Growing Market",
      description: "Tap into Nigeria's expanding real estate market"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your <span className="text-yellow-300">Affiliate Journey</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our affiliate program and start earning substantial commissions from sales of property and automobile you make and also from the sales from your syndicate
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            24-Hour Application Review
          </Badge>
        </div>
      </section>

      {/* Benefits Preview */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Apply to Become an Affiliate</h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll review your application within 24 hours
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                Affiliate Application Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Website/Social Media
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Affiliate Marketing Experience</Label>
                  <Select onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                      <SelectItem value="expert">Expert (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience">Describe Your Target Audience</Label>
                  <Textarea
                    id="audience"
                    placeholder="Tell us about your audience (e.g., demographics, interests, size)"
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Sales Methods */}
                <div className="space-y-2">
                  <Label htmlFor="referralMethods">How do you plan to sell properties and automobiles?</Label>
                  <Textarea
                    id="referralMethods"
                    placeholder="Describe your sales strategies (e.g., direct sales, social media marketing, networking)"
                    value={formData.referralMethods}
                    onChange={(e) => handleInputChange("referralMethods", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Expected Sales */}
                <div className="space-y-2">
                  <Label htmlFor="expectedReferrals">Expected Monthly Sales</Label>
                  <Select onValueChange={(value) => handleInputChange("expectedReferrals", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expected monthly sales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 sales</SelectItem>
                      <SelectItem value="6-15">6-15 sales</SelectItem>
                      <SelectItem value="16-30">16-30 sales</SelectItem>
                      <SelectItem value="30+">30+ sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional information you'd like to share about yourself or your business"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full text-lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Application
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    By submitting this form, you agree to our affiliate terms and conditions
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Review Process</h3>
              <p className="text-muted-foreground">We'll review your application within 24 hours</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Account Setup</h3>
              <p className="text-muted-foreground">Once approved, we'll set up your affiliate account</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Start Earning</h3>
              <p className="text-muted-foreground">Get your sales tools and start earning commissions</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartEarning;