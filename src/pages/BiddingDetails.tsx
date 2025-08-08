import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Car, Home, Users, Gavel, TrendingUp, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from an API
const auctionItems = [
  {
    id: 1,
    type: "car",
    title: "2018 Toyota Camry XLE",
    location: "Lagos, Nigeria",
    currentBid: "₦4,200,000",
    timeLeft: "2d 14h 32m",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
    description: "Well-maintained sedan with low mileage",
    minBidIncrement: 50000,
    startingBid: 3500000,
    totalBids: 12,
    highestBidder: "User123***"
  },
  {
    id: 2,
    type: "property",
    title: "3-Bedroom Duplex",
    location: "Abuja, Nigeria",
    currentBid: "₦15,500,000",
    timeLeft: "1d 8h 15m",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    description: "Modern duplex in a serene neighborhood",
    minBidIncrement: 100000,
    startingBid: 14000000,
    totalBids: 8,
    highestBidder: "PropInvestor***"
  },
  {
    id: 3,
    type: "car",
    title: "2020 Honda Accord Sport",
    location: "Port Harcourt, Nigeria",
    currentBid: "₦6,800,000",
    timeLeft: "4d 2h 45m",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    description: "Sporty sedan with excellent features",
    minBidIncrement: 75000,
    startingBid: 5800000,
    totalBids: 15,
    highestBidder: "CarEnthusiast***"
  }
];

const BiddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState("");

  const item = auctionItems.find(item => item.id === parseInt(id || "0"));

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Auction Item Not Found</h1>
            <Button onClick={() => navigate("/auction")}>Back to Auctions</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentBidValue = parseInt(item.currentBid.replace(/[₦,]/g, ""));
  const minNextBid = currentBidValue + item.minBidIncrement;

  const handlePlaceBid = () => {
    const bidValue = parseInt(bidAmount.replace(/[₦,]/g, ""));
    
    if (!bidAmount || bidValue < minNextBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid amount is ₦${minNextBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bid Placed Successfully!",
      description: `Your bid of ₦${bidValue.toLocaleString()} has been placed.`,
    });
    
    setBidAmount("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/auction")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Auctions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image and Basic Info */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Badge 
                variant="secondary" 
                className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm"
              >
                {item.type === "car" ? (
                  <><Car className="w-3 h-3 mr-1" /> Car</>
                ) : (
                  <><Home className="w-3 h-3 mr-1" /> Property</>
                )}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timeLeft}
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Bidding Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Current Auction Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Current Bid</Label>
                    <p className="text-2xl font-bold text-primary">{item.currentBid}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Bids</Label>
                    <p className="text-2xl font-bold">{item.totalBids}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Starting Bid</Label>
                    <p className="font-semibold">₦{item.startingBid.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Highest Bidder</Label>
                    <p className="font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.highestBidder}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Place Your Bid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bid-amount">Bid Amount (₦)</Label>
                  <Input
                    id="bid-amount"
                    type="text"
                    placeholder={`Minimum: ₦${minNextBid.toLocaleString()}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum increment: ₦{item.minBidIncrement.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Bid Options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 5].map((multiplier) => {
                      const quickBid = currentBidValue + (item.minBidIncrement * multiplier);
                      return (
                        <Button
                          key={multiplier}
                          variant="outline"
                          size="sm"
                          onClick={() => setBidAmount(quickBid.toString())}
                        >
                          ₦{quickBid.toLocaleString()}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceBid}
                  className="w-full"
                  variant="hero"
                  size="lg"
                >
                  Place Bid
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• By placing a bid, you agree to our terms and conditions</p>
                  <p>• All bids are final and cannot be cancelled</p>
                  <p>• You will be notified if you are outbid</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BiddingDetails;