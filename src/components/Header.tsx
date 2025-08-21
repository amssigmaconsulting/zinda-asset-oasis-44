
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAgent, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/auction", label: "Auction" },
    { to: "/real-estate", label: "Real Estate" },
    { to: "/automobiles", label: "Automobiles" },
    { to: "/find-agent", label: "Find Agent" },
    { to: "/search", label: "Buy" },
    { to: "/sell", label: "Sell" },
    { to: "/rent", label: "Rent" },
  ];

  const dashboardRoute = isAgent ? "/agent-dashboard" : "/dashboard";

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col space-y-3">
          {/* Logo Section */}
          <div className="flex justify-center">
            <Link 
              to="/about" 
              className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-8 sm:px-16 py-2 sm:py-3 rounded-lg shadow-lg hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              Zinda
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-foreground hover:text-primary transition-colors text-sm lg:text-base"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden touch-manipulation">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-6">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.to}
                        to={link.to} 
                        className="text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t pt-4 space-y-3">
                      <Link 
                        to="/affiliate-marketing" 
                        className="block text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                        onClick={() => setIsOpen(false)}
                      >
                        Join our Affiliate Marketing
                      </Link>
                      {user ? (
                        <>
                          <Link 
                            to={dashboardRoute}
                            className="block text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                            onClick={() => setIsOpen(false)}
                          >
                            Dashboard
                          </Link>
                          {isAdmin && (
                            <Link 
                              to="/admin"
                              className="block text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                              onClick={() => setIsOpen(false)}
                            >
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut();
                              setIsOpen(false);
                            }}
                            className="block w-full text-left text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/sell" 
                            className="block text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link 
                            to="/agent-auth" 
                            className="block text-foreground hover:text-primary transition-colors py-3 px-2 text-lg touch-manipulation"
                            onClick={() => setIsOpen(false)}
                          >
                            Agent/Broker Portal
                          </Link>
                        </>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Join Affiliate Marketing Button - Always Visible */}
              <Button variant="hero" asChild className="text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10 touch-manipulation">
                <Link to="/affiliate-marketing">
                  <span className="hidden sm:inline">Join our Affiliate Marketing</span>
                  <span className="sm:hidden">Affiliate</span>
                </Link>
              </Button>

              {/* Desktop Action Buttons - Sign In Last */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hidden md:flex text-sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={dashboardRoute} className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" className="hidden md:flex text-sm" asChild>
                    <Link to="/agent-auth">Agent/Broker Portal</Link>
                  </Button>
                  <Button variant="outline" className="hidden md:flex text-sm" asChild>
                    <Link to="/sell">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
