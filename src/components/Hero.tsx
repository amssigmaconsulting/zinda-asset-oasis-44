import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in leading-tight">
          Your Premier
          <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
            MLS Platform
          </span>
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in px-2">
          Access the most comprehensive Multiple Listing Service platform. Connect with verified agents, 
          share listings, and collaborate with real estate professionals nationwide.
        </p>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-6 max-w-4xl mx-auto shadow-elegant animate-scale-in">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Mobile: Stack everything vertically, Desktop: Use grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-1">
                <select className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-input rounded-md text-sm sm:text-base md:text-lg bg-background">
                  <option>Property Type</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Land</option>
                  <option>Multi-Family</option>
                </select>
              </div>
              <div className="sm:col-span-1 lg:col-span-2 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input 
                  placeholder="Enter location or search terms" 
                  className="pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <select className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-input rounded-md text-sm sm:text-base md:text-lg bg-background">
                  <option>Listing Status</option>
                  <option>Active Listings</option>
                  <option>Coming Soon</option>
                  <option>Under Contract</option>
                  <option>Sold</option>
                  <option>Off Market</option>
                </select>
              </div>
            </div>
            
            {/* Second row for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <select className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-input rounded-md text-sm sm:text-base md:text-lg bg-background">
                  <option>Price Range</option>
                  <option>Under ₦75M</option>
                  <option>₦75M - ₦150M</option>
                  <option>₦150M - ₦750M</option>
                  <option>₦750M - ₦1.5B</option>
                  <option>₦1.5B+</option>
                </select>
              </div>
              <Button variant="hero" size="lg" className="h-10 sm:h-12 px-4 sm:px-8 text-sm sm:text-base">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Search MLS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;