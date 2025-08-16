
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import Auction from "./pages/Auction";
import BiddingDetails from "./pages/BiddingDetails";
import RealEstate from "./pages/RealEstate";
import Automobiles from "./pages/Automobiles";
import Listings from "./pages/Listings";
import Search from "./pages/Search";
import ListingDetails from "./pages/ListingDetails";
import Sell from "./pages/Sell";
import Rent from "./pages/Rent";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ListingAnalytics from "./pages/ListingAnalytics";
import CreateAuction from "./pages/CreateAuction";
import AccountSuccess from "./pages/AccountSuccess";
import RentalResults from "./pages/RentalResults";
import RentalDetails from "./pages/RentalDetails";
import AutomobileDetails from "./pages/AutomobileDetails";
import SearchResults from "./pages/SearchResults";
import RelatedAssets from "./pages/RelatedAssets";
import AssetListings from "./pages/AssetListings";
import Assets from "./pages/Assets";
import FindAgent from "./pages/FindAgent";
import AgentListings from "./pages/AgentListings";
import AgentAuth from "./pages/AgentAuth";
import AgentDashboard from "./pages/AgentDashboard";
import AgentProfileEdit from "./pages/AgentProfileEdit";
import ProfileEdit from "./pages/ProfileEdit";
import PasswordReset from "./pages/PasswordReset";
import AdminDashboard from "./pages/AdminDashboard";
import AffiliateMarketing from "./pages/AffiliateMarketing";
import StartEarning from "./pages/StartEarning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/auction/:id" element={<BiddingDetails />} />
        <Route path="/real-estate" element={<RealEstate />} />
        <Route path="/automobiles" element={<Automobiles />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-listing" element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          } />
          <Route path="/edit-listing/:id" element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          } />
          <Route path="/listing-analytics/:id" element={
            <ProtectedRoute>
              <ListingAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/create-auction" element={
            <ProtectedRoute>
              <CreateAuction />
            </ProtectedRoute>
          } />
          <Route path="/account-success" element={<AccountSuccess />} />
          <Route path="/rental-results" element={<RentalResults />} />
          <Route path="/rental/:id" element={<RentalDetails />} />
          <Route path="/automobile/:id" element={<AutomobileDetails />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/related-assets/:id" element={<RelatedAssets />} />
          <Route path="/asset-listings/:id" element={<AssetListings />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/find-agent" element={<FindAgent />} />
          <Route path="/agents/:category" element={<AgentListings />} />
          <Route path="/agent-auth" element={<AgentAuth />} />
          <Route path="/agent-dashboard" element={
            <ProtectedRoute redirectTo="/agent-auth">
              <AgentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/agent-profile-edit" element={
            <ProtectedRoute redirectTo="/agent-auth">
              <AgentProfileEdit />
            </ProtectedRoute>
          } />
          <Route path="/profile-edit" element={
            <ProtectedRoute redirectTo="/sell">
              <ProfileEdit />
            </ProtectedRoute>
          } />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/affiliate-marketing" element={<AffiliateMarketing />} />
          <Route path="/start-earning" element={<StartEarning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
