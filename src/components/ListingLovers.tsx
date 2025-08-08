import { useState, useEffect } from "react";
import { Heart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ListingLoversProps {
  listingId: string;
}

interface Lover {
  user_id: string;
  name: string;
  avatar_url?: string;
  loved_at: string;
}

export const ListingLovers = ({ listingId }: ListingLoversProps) => {
  const [lovers, setLovers] = useState<Lover[]>([]);
  const [totalLoves, setTotalLoves] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLovers = async () => {
      try {
        const { data, error } = await supabase.rpc('get_listing_loves', {
          listing_id_param: listingId
        });

        if (error) {
          console.error('Error fetching lovers:', error);
          return;
        }

        if (data && data.length > 0) {
          setTotalLoves(data[0].total_loves || 0);
          const userLoves = data[0].user_loves;
          if (Array.isArray(userLoves)) {
            setLovers(userLoves as unknown as Lover[]);
          }
        }
      } catch (error) {
        console.error('Error fetching lovers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLovers();
  }, [listingId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Listing Loves
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (totalLoves === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Listing Loves
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No one has loved this listing yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-current text-red-500" />
          Listing Loves ({totalLoves})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {lovers.map((lover) => (
            <div key={lover.user_id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={lover.avatar_url} />
                <AvatarFallback>
                  {lover.name ? lover.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {lover.name || 'Anonymous User'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Loved on {new Date(lover.loved_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};