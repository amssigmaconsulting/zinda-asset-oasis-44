import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const AccountSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Account Created Successfully!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Welcome to Zinda! Your account has been created and you're ready to start buying and selling.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-foreground mb-2">What's next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse listings and make your first purchase</li>
                  <li>• Create your first listing to start selling</li>
                  <li>• Complete your profile in the dashboard</li>
                  <li>• Explore auction items and place bids</li>
                </ul>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                A confirmation email has been sent to your email address.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSuccess;