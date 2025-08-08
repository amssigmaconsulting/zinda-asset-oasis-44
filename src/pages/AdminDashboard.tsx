import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, User, Users, Building, Building2 } from "lucide-react";

type UserProfile = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_notes: string | null;
};

type AgentProfile = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  location: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_notes: string | null;
};

type DealerProfile = {
  user_id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_notes: string | null;
};

type CompanyProfile = {
  user_id: string;
  company_name: string;
  registration_number: string;
  contact_person: string;
  email: string;
  address: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_notes: string | null;
};

const AdminDashboard = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [agentProfiles, setAgentProfiles] = useState<AgentProfile[]>([]);
  const [dealerProfiles, setDealerProfiles] = useState<DealerProfile[]>([]);
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationNotes, setVerificationNotes] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch all profile types
      const [usersRes, agentsRes, dealersRes, companiesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('agent_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('dealer_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('company_profiles').select('*').order('created_at', { ascending: false })
      ]);

      if (usersRes.error) throw usersRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (dealersRes.error) throw dealersRes.error;
      if (companiesRes.error) throw companiesRes.error;

      setUserProfiles(usersRes.data || []);
      setAgentProfiles(agentsRes.data || []);
      setDealerProfiles(dealersRes.data || []);
      setCompanyProfiles(companiesRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      const notes = verificationNotes[userId] || '';
      const { error } = await supabase.rpc('verify_user_profile', {
        target_user_id: userId,
        verification_notes_param: notes
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User verified successfully",
      });

      fetchAllProfiles();
      setVerificationNotes(prev => ({ ...prev, [userId]: '' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyAgent = async (userId: string) => {
    try {
      const notes = verificationNotes[userId] || '';
      const { error } = await supabase.rpc('verify_agent_profile', {
        target_user_id: userId,
        verification_notes_param: notes
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent verified successfully",
      });

      fetchAllProfiles();
      setVerificationNotes(prev => ({ ...prev, [userId]: '' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyDealer = async (userId: string) => {
    try {
      const notes = verificationNotes[userId] || '';
      const { error } = await supabase.rpc('verify_dealer_profile', {
        target_user_id: userId,
        verification_notes_param: notes
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dealer verified successfully",
      });

      fetchAllProfiles();
      setVerificationNotes(prev => ({ ...prev, [userId]: '' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyCompany = async (userId: string) => {
    try {
      const notes = verificationNotes[userId] || '';
      const { error } = await supabase.rpc('verify_company_profile', {
        target_user_id: userId,
        verification_notes_param: notes
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company verified successfully",
      });

      fetchAllProfiles();
      setVerificationNotes(prev => ({ ...prev, [userId]: '' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Verification Dashboard</h1>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Agents</span>
            <span className="sm:hidden">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="dealers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Dealers</span>
            <span className="sm:hidden">Dealers</span>
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Companies</span>
            <span className="sm:hidden">Companies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {userProfiles.map((profile) => (
              <Card key={profile.user_id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">
                      {profile.first_name} {profile.last_name}
                    </CardTitle>
                    <Badge variant={profile.is_verified ? "verified" : "secondary"}>
                      {profile.is_verified ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {profile.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Email: {profile.email}</p>
                    {profile.verified_at && (
                      <p>Verified: {new Date(profile.verified_at).toLocaleDateString()}</p>
                    )}
                    {profile.verification_notes && (
                      <p>Notes: {profile.verification_notes}</p>
                    )}
                  </div>
                  
                  {!profile.is_verified && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Verification notes (optional)"
                        value={verificationNotes[profile.user_id] || ''}
                        onChange={(e) => setVerificationNotes(prev => ({
                          ...prev,
                          [profile.user_id]: e.target.value
                        }))}
                      />
                      <Button onClick={() => handleVerifyUser(profile.user_id)}>
                        Verify User
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agentProfiles.map((profile) => (
              <Card key={profile.user_id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <Badge variant={profile.is_verified ? "verified" : "secondary"}>
                      {profile.is_verified ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {profile.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Email: {profile.email}</p>
                    <p>Phone: {profile.phone}</p>
                    <p>Location: {profile.location}</p>
                    <p>Specialties: {profile.specialties?.join(', ') || 'None'}</p>
                    {profile.verified_at && (
                      <p>Verified: {new Date(profile.verified_at).toLocaleDateString()}</p>
                    )}
                    {profile.verification_notes && (
                      <p>Notes: {profile.verification_notes}</p>
                    )}
                  </div>
                  
                  {!profile.is_verified && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Verification notes (optional)"
                        value={verificationNotes[profile.user_id] || ''}
                        onChange={(e) => setVerificationNotes(prev => ({
                          ...prev,
                          [profile.user_id]: e.target.value
                        }))}
                      />
                      <Button onClick={() => handleVerifyAgent(profile.user_id)}>
                        Verify Agent
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dealers" className="space-y-4">
          <div className="grid gap-4">
            {dealerProfiles.map((profile) => (
              <Card key={profile.user_id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">{profile.company_name}</CardTitle>
                    <Badge variant={profile.is_verified ? "verified" : "secondary"}>
                      {profile.is_verified ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {profile.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Contact: {profile.contact_person}</p>
                    <p>Email: {profile.email}</p>
                    <p>Phone: {profile.phone}</p>
                    <p>Address: {profile.address}</p>
                    {profile.verified_at && (
                      <p>Verified: {new Date(profile.verified_at).toLocaleDateString()}</p>
                    )}
                    {profile.verification_notes && (
                      <p>Notes: {profile.verification_notes}</p>
                    )}
                  </div>
                  
                  {!profile.is_verified && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Verification notes (optional)"
                        value={verificationNotes[profile.user_id] || ''}
                        onChange={(e) => setVerificationNotes(prev => ({
                          ...prev,
                          [profile.user_id]: e.target.value
                        }))}
                      />
                      <Button onClick={() => handleVerifyDealer(profile.user_id)}>
                        Verify Dealer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <div className="grid gap-4">
            {companyProfiles.map((profile) => (
              <Card key={profile.user_id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg">{profile.company_name}</CardTitle>
                    <Badge variant={profile.is_verified ? "verified" : "secondary"}>
                      {profile.is_verified ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {profile.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Registration #: {profile.registration_number}</p>
                    <p>Contact: {profile.contact_person}</p>
                    <p>Email: {profile.email}</p>
                    <p>Address: {profile.address}</p>
                    {profile.verified_at && (
                      <p>Verified: {new Date(profile.verified_at).toLocaleDateString()}</p>
                    )}
                    {profile.verification_notes && (
                      <p>Notes: {profile.verification_notes}</p>
                    )}
                  </div>
                  
                  {!profile.is_verified && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Verification notes (optional)"
                        value={verificationNotes[profile.user_id] || ''}
                        onChange={(e) => setVerificationNotes(prev => ({
                          ...prev,
                          [profile.user_id]: e.target.value
                        }))}
                      />
                      <Button onClick={() => handleVerifyCompany(profile.user_id)}>
                        Verify Company
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;