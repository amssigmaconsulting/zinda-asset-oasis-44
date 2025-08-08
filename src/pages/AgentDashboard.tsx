import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Eye, 
  MessageSquare, 
  Edit, 
  LogOut,
  BarChart3,
  Users,
  Home,
  Calendar,
  CreditCard,
  Plus,
  Gavel
} from 'lucide-react';
import Header from '@/components/Header';
import CreditManagement from '@/components/CreditManagement';

interface AgentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  languages?: string[];
  location?: string;
  bio?: string;
  experience_years: number;
  profile_image_url?: string;
  license_number?: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [agentListings, setAgentListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState([
    { title: 'Profile Views', value: '0', icon: Eye, change: '0%' },
    { title: 'Total Inquiries', value: '0', icon: MessageSquare, change: '0%' },
    { title: 'Active Listings', value: '0', icon: Home, change: '0' },
    { title: 'This Month', value: '0', icon: Calendar, change: '0' },
  ]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/agent-auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/agent-auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('agent_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching agent profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load agent profile. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        setAgentProfile(data);
        
        // Also fetch agent listings
        const { data: listingsData } = await supabase
          .from('property_listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        setAgentListings(listingsData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAgentProfile();
    }
  }, [user, toast]);

  // Fetch agent analytics
  useEffect(() => {
    const fetchAgentAnalytics = async () => {
      if (!user || !agentProfile) return;

      try {
        const { data: analyticsData, error } = await supabase
          .rpc('get_agent_dashboard_analytics', { agent_user_id: user.id });

        if (error) {
          console.error('Error fetching agent analytics:', error);
          return;
        }

        if (analyticsData && analyticsData.length > 0) {
          const stats = analyticsData[0];
          setDashboardStats([
            { title: 'Total Views', value: String(stats.total_views), icon: Eye, change: '+12%' },
            { title: 'Total Inquiries', value: String(stats.total_inquiries), icon: MessageSquare, change: '+8%' },
            { title: 'Active Listings', value: String(stats.active_listings), icon: Home, change: `+${stats.listings_this_month}` },
            { title: 'This Month', value: String(stats.listings_this_month), icon: Calendar, change: '+1' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAgentAnalytics();
  }, [user, agentProfile]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to sign out. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!agentProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>
                We couldn't find your agent profile. Please contact support for assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/agent-auth')}>
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {agentProfile.name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your profile and track your performance
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Agent Profile</CardTitle>
                      <CardDescription>
                        Your public profile information
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/agent-profile-edit')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserIcon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{agentProfile.name}</h3>
                         {agentProfile.is_verified && (
                           <Badge variant="verified" className="text-xs">
                             Verified
                           </Badge>
                         )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{agentProfile.rating}</span>
                          <span>({agentProfile.total_reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{agentProfile.experience_years} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{agentProfile.email}</span>
                        </div>
                        {agentProfile.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agentProfile.phone}</span>
                          </div>
                        )}
                        {agentProfile.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agentProfile.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Professional Details</h4>
                      <div className="space-y-3">
                        {agentProfile.license_number && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">License Number</p>
                            <p className="text-sm">{agentProfile.license_number}</p>
                          </div>
                        )}
                        {agentProfile.specialties && agentProfile.specialties.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Specialties</p>
                            <div className="flex flex-wrap gap-1">
                              {agentProfile.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {agentProfile.languages && agentProfile.languages.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Languages</p>
                            <div className="flex flex-wrap gap-1">
                              {agentProfile.languages.map((language, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {language.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {agentProfile.bio && (
                    <div>
                      <h4 className="font-medium mb-2">About Me</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {agentProfile.bio}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Listings</CardTitle>
                    <CardDescription>
                      Manage your property listings and auctions
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate('/create-listing')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/create-auction')}>
                      <Gavel className="h-4 w-4 mr-2" />
                      Create Auction
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {agentListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first property listing
                    </p>
                    <Button onClick={() => navigate('/create-listing')}>Create New Listing</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agentListings.map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{listing.title}</h4>
                            <p className="text-sm text-muted-foreground">{listing.location}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                                {listing.status}
                              </Badge>
                  <Badge variant="outline">
                    {listing.listing_purpose === "sale" ? "For Sale" : listing.listing_purpose === "rent" ? "For Rent" : "For Auction"}
                  </Badge>
                              <span className="text-sm font-medium">₦{listing.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/listing-analytics/${listing.id}`)}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/edit-listing/${listing.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Management
                </CardTitle>
                <CardDescription>
                  Purchase and manage your credits for enhanced features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreditManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Client Inquiries</CardTitle>
                <CardDescription>
                  Messages and inquiries from potential clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No inquiries yet</h3>
                  <p className="text-muted-foreground">
                    Client inquiries will appear here when you receive them
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your profile performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardStats.map((stat, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.title}
                            </p>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {stat.change}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <stat.icon className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">
                      Analytics are updated in real-time based on your listing performance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;