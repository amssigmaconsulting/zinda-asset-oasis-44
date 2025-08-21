import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Eye, MessageCircle, DollarSign, Package, TrendingUp, Edit3, Trash2, Plus, LogOut, Upload, User, Settings, Coins, Gavel } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreditManagement from "@/components/CreditManagement";
import AgentNetwork from "@/components/AgentNetwork";

interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface CreditBalance {
  balance: number;
}

interface PropertyListing {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  property_type: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  status: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeListings, setActiveListings] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/sell');
        } else {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/sell');
      } else {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setUserProfile(profile);
      }

      // Fetch property listings
      const { data: listings, error: listingsError } = await supabase
        .from('property_listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
      } else {
        setActiveListings(listings || []);
      }

      // Fetch user credits
      const { data: creditData, error: creditError } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (creditError && creditError.code !== 'PGRST116') {
        console.error('Error fetching credits:', creditError);
      } else {
        setCredits(creditData?.balance || 0);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      // Refresh listings
      if (user) fetchUserData(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh user data
      fetchUserData(user.id);
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const recentActivity = [
    { id: 1, action: "Joined MLS Network", item: "Welcome to the MLS platform!", time: "Today" },
    { id: 2, action: "Profile Verified", item: "Agent status activated", time: "Today" },
    { id: 3, action: "MLS Access Granted", item: "Full platform access enabled", time: "Today" },
  ];

  const stats = [
    { title: "MLS Credits", value: credits.toString(), icon: Coins, change: "Available balance" },
    { title: "Total Listings", value: activeListings.length.toString(), icon: Package, change: "In MLS database" },
    { title: "Active Listings", value: activeListings.filter(l => l.status === 'active').length.toString(), icon: TrendingUp, change: "Live on MLS" },
    { title: "MLS Status", value: "Verified Agent", icon: MessageCircle, change: "Full MLS access" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading your dashboard...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              MLS Agent Dashboard{userProfile?.first_name ? ` - ${userProfile.first_name}` : ''}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your MLS listings, collaborate with agents, and access market insights.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/create-listing">
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/create-auction">
                <Gavel className="h-4 w-4 mr-2" />
                Create Auction
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="listings">MLS Listings</TabsTrigger>
            <TabsTrigger value="network">Agent Network</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
            <TabsTrigger value="activity">MLS Activity</TabsTrigger>
            <TabsTrigger value="profile">Agent Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {activeListings.length === 0 ? (
              <Card className="border-border">
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first listing to start selling your property.</p>
                  <Button asChild>
                    <Link to="/create-listing">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeListings.map((listing) => (
                  <Card key={listing.id} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            {listing.images.length > 0 ? (
                              <img 
                                src={listing.images[0]} 
                                alt={listing.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{listing.property_type}</p>
                            <p className="text-sm text-muted-foreground">{listing.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                            {listing.status}
                          </Badge>
                          <span className="font-semibold text-foreground">${listing.price.toLocaleString()}</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/edit-listing/${listing.id}`}>
                                <Edit3 className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/listing-analytics/${listing.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteListing(listing.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <AgentNetwork />
          </TabsContent>

          <TabsContent value="credits" className="space-y-4">
            <CreditManagement />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">MLS Activity Feed</CardTitle>
                <CardDescription>Your recent MLS activities and platform updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.item} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  MLS Agent Profile
                </CardTitle>
                <CardDescription>Manage your MLS agent profile and verification status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userProfile?.avatar_url} alt="Profile" />
                    <AvatarFallback>
                      {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {userProfile?.first_name} {userProfile?.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                    <div className="mt-2">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" disabled={uploadingImage} asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name"
                        value={userProfile?.first_name || 'Not provided'} 
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name"
                        value={userProfile?.last_name || 'Not provided'} 
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        value={userProfile?.email || ''} 
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={userProfile?.phone || 'Not provided'} 
                        readOnly 
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile-edit')}
                      className="w-full md:w-auto"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;