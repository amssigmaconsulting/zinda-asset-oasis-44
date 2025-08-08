import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  MessageCircle,
  Phone,
  Mail,
  Filter
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactAgentDialog } from "@/components/ContactAgentDialog";
import { supabase } from "@/integrations/supabase/client";

const AgentListings = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch agents from database
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agent_profiles')
          .select('*');
          
        if (error) {
          console.error('Error fetching agents:', error);
          return;
        }

        // Filter agents based on category
        const categoryKeywords = {
          'real-estate': ['residential', 'real estate', 'property', 'home', 'land', 'commercial', 'luxury'],
          'automobile-agents': ['automobile', 'car', 'vehicle', 'auto', 'automotive'],
          'property-managers': ['management', 'manager', 'rental', 'property manager'],
          'home-inspectors': ['inspector', 'inspection', 'home inspector'],
          'automobile-inspectors': ['inspector', 'inspection', 'vehicle inspector', 'auto inspector']
        };

        const categoryKeys = categoryKeywords[category as keyof typeof categoryKeywords] || [];
        
        let filteredAgents = data || [];
        
        // Filter by category if specified
        if (category && category !== 'all' && categoryKeys.length > 0) {
          filteredAgents = data?.filter(agent => {
            const specialtiesText = (agent.specialties || []).join(' ').toLowerCase();
            return categoryKeys.some(keyword => 
              specialtiesText.includes(keyword.toLowerCase())
            );
          }) || [];
        }

        setAgents(filteredAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [category]);

  const categoryTitles = {
    "real-estate": "Real Estate Agents",
    "property-managers": "Property Managers",
    "home-inspectors": "Home Inspectors",
    "automobile-agents": "Automobile Agents",
    "automobile-inspectors": "Automobile Inspectors"
  };

  // Get unique values for dropdowns
  const allLocations = [...new Set(agents.map(agent => agent.location).filter(Boolean))];
  const allSpecialties = [...new Set(agents.flatMap(agent => agent.specialties || []))];
  const allLanguages = [...new Set(agents.flatMap(agent => agent.languages || []))];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === "" || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.location && agent.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (agent.specialties || []).some((specialty: string) => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesLocation = locationFilter === "" || locationFilter === "all" || agent.location === locationFilter;
    const matchesName = nameFilter === "" || agent.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesSpecialty = specialtyFilter === "" || specialtyFilter === "all" || (agent.specialties || []).includes(specialtyFilter);
    const matchesLanguage = languageFilter === "" || languageFilter === "all" || (agent.languages || []).includes(languageFilter);

    return matchesSearch && matchesLocation && matchesName && matchesSpecialty && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading agents...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/find-agent")}
            className="mb-4"
          >
            ← Back to Categories
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {categoryTitles[category as keyof typeof categoryTitles] || "All Agents"}
          </h1>
          <p className="text-muted-foreground">
            Find verified professionals in your area. {filteredAgents.length} agents available.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {allLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {allSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {allLanguages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-elegant transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {agent.location || "Location not specified"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{agent.rating || "New"}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({agent.total_reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {agent.experience_years || 0} years experience
                    </span>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {(agent.specialties || []).map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {(agent.languages || []).map((language: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-4">
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

export default AgentListings;