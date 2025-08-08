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

interface MarketTrendsRequest {
  subject?: string;
  content?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, content }: MarketTrendsRequest = await req.json();

    // Get all active newsletter subscribers
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('is_active', true);

    if (error) {
      console.error("Error fetching subscribers:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscribers" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active subscribers found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailSubject = subject || "Weekly Real Estate Market Trends";
    const emailContent = content || `
      <h1>Weekly Real Estate Market Trends</h1>
      <p>Here are the latest trends in the real estate market:</p>
      
      <h2>🏠 Market Highlights</h2>
      <ul>
        <li>Property values continue to show steady growth in key metropolitan areas</li>
        <li>Interest rates remain competitive for qualified buyers</li>
        <li>Inventory levels are improving in most markets</li>
      </ul>
      
      <h2>📈 Investment Opportunities</h2>
      <ul>
        <li>Emerging neighborhoods showing strong appreciation potential</li>
        <li>Commercial real estate opportunities in tech corridors</li>
        <li>Rental properties in high-demand areas</li>
      </ul>
      
      <h2>💡 Expert Tips</h2>
      <ul>
        <li>Consider market timing for optimal investment returns</li>
        <li>Research local zoning changes and development plans</li>
        <li>Evaluate property condition and potential renovation costs</li>
      </ul>
      
      <p>Stay tuned for more insights next week!</p>
      <p>Best regards,<br>The Real Estate Hub Team</p>
    `;

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: "Real Estate Hub <onboarding@resend.dev>",
        to: [subscriber.email],
        subject: emailSubject,
        html: `
          ${emailContent}
          <hr>
          <p style="font-size: 12px; color: #666;">
            You're receiving this because you subscribed to our Real Estate Market Trends newsletter.<br>
            If you no longer wish to receive these emails, please contact us.
          </p>
        `,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Newsletter sent to ${successful} subscribers, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        message: `Newsletter sent successfully to ${successful} subscribers`,
        failed: failed > 0 ? `${failed} emails failed to send` : null
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-market-trends function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);