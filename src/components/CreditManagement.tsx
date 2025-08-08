import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins, CreditCard, History, Plus, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreditBalance {
  balance: number;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description?: string;
  created_at: string;
}

const CreditManagement = () => {
  const { toast } = useToast();
  const [credits, setCredits] = useState<number>(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const creditPackages = [
    { credits: 10, price: 1000, label: '10 Credits', popular: false },
    { credits: 50, price: 4500, label: '50 Credits', popular: true },
    { credits: 100, price: 8500, label: '100 Credits', popular: false },
    { credits: 250, price: 20000, label: '250 Credits', popular: false },
    { credits: 500, price: 37500, label: '500 Credits', popular: false },
  ];

  useEffect(() => {
    fetchCreditData();
    
    // Check for payment success on component mount
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const reference = urlParams.get('reference');
      if (reference) {
        verifyPayment(reference);
      }
    }
  }, []);

  const fetchCreditData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch current credit balance
      const { data: creditData, error: creditError } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (creditError && creditError.code !== 'PGRST116') {
        console.error('Error fetching credits:', creditError);
      } else {
        setCredits(creditData?.balance || 0);
      }

      // Fetch credit transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
      } else {
        setTransactions(transactionData || []);
      }
    } catch (error) {
      console.error('Error in fetchCreditData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast({
        title: 'Error',
        description: 'Please select a credit package',
        variant: 'destructive',
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const packageData = creditPackages.find(pkg => pkg.credits.toString() === selectedPackage);
      if (!packageData) return;

      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: {
          credits: packageData.credits,
          amount: packageData.price,
        },
      });

      if (error) throw error;

      // Redirect to Paystack payment page
      window.open(data.authorization_url, '_blank');
      
      toast({
        title: 'Redirecting to Payment',
        description: 'You will be redirected to complete your payment.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference },
      });

      if (error) throw error;

      toast({
        title: 'Payment Successful!',
        description: `${data.credits_added} credits have been added to your account.`,
      });

      // Refresh credit data
      fetchCreditData();
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('reference');
      window.history.replaceState({}, '', url.toString());
    } catch (error: any) {
      toast({
        title: 'Payment Verification Failed',
        description: error.message || 'Please contact support',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading credit information...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credit Balance Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Current Credit Balance
          </CardTitle>
          <CardDescription>
            Credits are used for posting listings, auctions, and advertisements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">{credits.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">
            Credits available • Each listing costs 5 credits
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="purchase" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase">Purchase Credits</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Buy Credits
              </CardTitle>
              <CardDescription>
                Choose a credit package to purchase. Payments are processed securely via Paystack.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creditPackages.map((pkg) => (
                  <Card
                    key={pkg.credits}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedPackage === pkg.credits.toString()
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${pkg.popular ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedPackage(pkg.credits.toString())}
                  >
                    <CardHeader className="text-center relative">
                      {pkg.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                          Most Popular
                        </Badge>
                      )}
                      <CardTitle className="text-lg">{pkg.label}</CardTitle>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(pkg.price)}
                      </div>
                      <CardDescription>
                        {(pkg.price / pkg.credits).toFixed(0)} NGN per credit
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handlePurchase}
                  disabled={!selectedPackage || isPurchasing}
                  size="lg"
                  className="w-full max-w-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isPurchasing ? 'Processing...' : 'Purchase Credits'}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Secure payment processing via Paystack</p>
                <p>• Credits are added instantly after successful payment</p>
                <p>• All transactions are recorded for your reference</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                View your recent credit transactions and purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">
                    Your credit purchases and usage will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.amount > 0
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? (
                            <Plus className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description || 
                              `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} transaction`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                        </p>
                        <Badge variant={transaction.type === 'purchase' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreditManagement;