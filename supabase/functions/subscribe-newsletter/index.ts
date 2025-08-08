import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscribeRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if email already exists
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return new Response(
          JSON.stringify({ message: "Email is already subscribed to the newsletter" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscriptions')
          .update({ is_active: true })
          .eq('email', email);
      }
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email });

      if (error) {
        console.error("Error creating subscription:", error);
        return new Response(
          JSON.stringify({ error: "Failed to subscribe" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: "Real Estate Hub <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Real Estate Market Trends Newsletter!",
        html: `
          <h1>Welcome to Real Estate Market Trends!</h1>
          <p>Thank you for subscribing to our newsletter. You'll now receive the latest market trends and investment opportunities directly in your inbox.</p>
          <p>Stay informed with:</p>
          <ul>
            <li>Market analysis and trends</li>
            <li>Investment opportunities</li>
            <li>Property market insights</li>
            <li>Expert tips and advice</li>
          </ul>
          <p>Best regards,<br>The Real Estate Hub Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">If you no longer wish to receive these emails, please contact us.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    return new Response(
      JSON.stringify({ message: "Successfully subscribed to newsletter!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in subscribe-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);