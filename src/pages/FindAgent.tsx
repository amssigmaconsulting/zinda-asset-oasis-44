import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Search, 
  Car, 
  ClipboardCheck,
  ArrowRight,
  MapPin,
  Star,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactAgentDialog } from "@/components/ContactAgentDialog";
import { supabase } from "@/integrations/supabase/client";

const FindAgent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [agents, setAgents] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const agentCategories = [
    {
      icon: Building2,
      title: "Real Estate Agents",
      description: "Find certified real estate professionals to help you buy, sell, or rent properties",
      color: "from-blue-500 to-cyan-500",
      category: "real-estate"
    },
    {
      icon: Users,
      title: "Property Managers",
      description: "Connect with experienced property managers to handle your rental properties",
      color: "from-green-500 to-emerald-500",
      category: "property-managers"
    },
    {
      icon: Search,
      title: "Home Inspectors",
      description: "Get qualified home inspectors to ensure your property meets all standards",
      color: "from-purple-500 to-violet-500",
      category: "home-inspectors"
    },
    {
      icon: Car,
      title: "Automobile Agents",
      description: "Find trusted automobile brokers and sales professionals",
      color: "from-orange-500 to-red-500",
      category: "automobile-agents"
    },
    {
      icon: ClipboardCheck,
      title: "Automobile Inspectors",
      description: "Connect with certified vehicle inspectors for pre-purchase evaluations",
      color: "from-indigo-500 to-blue-500",
      category: "automobile-inspectors"
    }
  ];

  // Fetch agents and sellers from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agents
        const { data: agentData, error: agentError } = await supabase
          .from('agent_profiles')
          .select('*');
          
        if (agentError) {
          console.error('Error fetching agents:', agentError);
        } else {
          setAgents(agentData || []);
        }

        // Fetch sellers (users with listings)
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select(`
            *,
            property_listings!inner(id)
          `);
          
        if (sellerError) {
          console.error('Error fetching sellers:', sellerError);
        } else {
          setSellers(sellerData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter agents based on category and search
  const getFilteredAgents = () => {
    let filtered = agents;
    
    if (selectedCategory !== "all") {
      const categoryKeywords = {
        'real-estate': ['residential', 'real estate', 'property', 'home', 'land', 'commercial', 'luxury'],
        'automobile-agents': ['automobile', 'car', 'vehicle', 'auto', 'automotive'],
        'property-managers': ['management', 'manager', 'rental', 'property manager'],
        'home-inspectors': ['inspector', 'inspection', 'home inspector'],
        'automobile-inspectors': ['inspector', 'inspection', 'vehicle inspector', 'auto inspector']
      };

      const categoryKeys = categoryKeywords[selectedCategory as keyof typeof categoryKeywords] || [];
      
      if (categoryKeys.length > 0) {
        filtered = agents.filter(agent => {
          const specialtiesText = (agent.specialties || []).join(' ').toLowerCase();
          return categoryKeys.some(keyword => 
            specialtiesText.includes(keyword.toLowerCase())
          );
        });
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.location && agent.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.specialties || []).some((specialty: string) => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  };

  // Filter sellers based on search
  const getFilteredSellers = () => {
    if (!searchTerm) return sellers;
    
    return sellers.filter(seller => 
      (seller.first_name && seller.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (seller.last_name && seller.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">Loading agents and sellers...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredAgents = getFilteredAgents();
  const filteredSellers = getFilteredSellers();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find the Right 
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified agents and sellers across real estate and automobile sectors. 
            Find the expertise you need for your next investment.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All
              </Button>
              {agentCategories.map((category) => (
                <Button 
                  key={category.category}
                  variant={selectedCategory === category.category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.category)}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Agents Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Registered Agents ({filteredAgents.length})
          </h2>
          {filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No agents found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {agent.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      {agent.is_verified && (
                        <Badge variant="verified" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center justify-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {agent.location || "Location not specified"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{agent.rating || "New"}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        ({agent.total_reviews || 0} reviews)
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">
                        {agent.experience_years || 0} years experience
                      </span>
                    </div>

                    {agent.specialties && agent.specialties.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.slice(0, 3).map((specialty: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setContactDialogOpen(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${agent.phone}`, "_self")}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${agent.email}`, "_self")}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sellers Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Property Sellers ({filteredSellers.length})
          </h2>
          {filteredSellers.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sellers found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSellers.map((seller) => (
                <Card key={seller.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {(seller.first_name || seller.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CardTitle className="text-lg">
                        {seller.first_name && seller.last_name 
                          ? `${seller.first_name} ${seller.last_name}`
                          : seller.email.split('@')[0]
                        }
                      </CardTitle>
                      {seller.is_verified && (
                        <Badge variant="verified" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Property Seller</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Badge variant="outline">Active Seller</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAgent({
                            name: seller.first_name && seller.last_name 
                              ? `${seller.first_name} ${seller.last_name}`
                              : seller.email.split('@')[0],
                            email: seller.email
                          });
                          setContactDialogOpen(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`mailto:${seller.email}`, "_self")}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Category Shortcuts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-card/50 backdrop-blur-sm"
                  onClick={() => navigate(`/agents/${category.category}`)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4 text-sm">
                      {category.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      size="sm"
                    >
                      View Category
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

      {/* Contact Dialog */}
      <ContactAgentDialog
        agentName={selectedAgent?.name || ""}
        agentEmail={selectedAgent?.email || ""}
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
};

export default FindAgent;