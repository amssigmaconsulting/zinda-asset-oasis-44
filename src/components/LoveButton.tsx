import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoveButtonProps {
  listingId: string;
  initialLoveCount?: number;
  showCount?: boolean;
  className?: string;
}

export const LoveButton = ({ 
  listingId, 
  initialLoveCount = 0, 
  showCount = true,
  className 
}: LoveButtonProps) => {
  const { user } = useAuth();
  const [isLoved, setIsLoved] = useState(false);
  const [loveCount, setLoveCount] = useState(initialLoveCount);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has loved this listing
  useEffect(() => {
    const checkIfLoved = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('listing_loves')
          .select('id')
          .eq('listing_id', listingId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking love status:', error);
          return;
        }

        setIsLoved(!!data);
      } catch (error) {
        console.error('Error checking love status:', error);
      }
    };

    checkIfLoved();
  }, [user, listingId]);

  // Get love count
  useEffect(() => {
    const getLoveCount = async () => {
      try {
        const { count, error } = await supabase
          .from('listing_loves')
          .select('*', { count: 'exact', head: true })
          .eq('listing_id', listingId);

        if (error) {
          console.error('Error getting love count:', error);
          return;
        }

        setLoveCount(count || 0);
      } catch (error) {
        console.error('Error getting love count:', error);
      }
    };

    getLoveCount();
  }, [listingId]);

  const handleLoveToggle = async () => {
    if (!user) {
      toast.error("Please sign in to love listings");
      return;
    }

    setIsLoading(true);

    try {
      if (isLoved) {
        // Remove love
        const { error } = await supabase
          .from('listing_loves')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id);

        if (error) throw error;

        setIsLoved(false);
        setLoveCount(prev => Math.max(0, prev - 1));
        toast.success("Removed from loved listings");
      } else {
        // Add love
        const { error } = await supabase
          .from('listing_loves')
          .insert({
            listing_id: listingId,
            user_id: user.id
          });

        if (error) throw error;

        setIsLoved(true);
        setLoveCount(prev => prev + 1);
        toast.success("Added to loved listings");
      }
    } catch (error) {
      console.error('Error toggling love:', error);
      toast.error("Failed to update love status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isLoved ? "default" : "outline"}
      size="sm"
      onClick={handleLoveToggle}
      disabled={isLoading}
      className={className}
    >
      <Heart 
        className={`h-4 w-4 ${isLoved ? 'fill-current' : ''}`}
      />
      {showCount && <span className="ml-1">{loveCount}</span>}
    </Button>
  );
};