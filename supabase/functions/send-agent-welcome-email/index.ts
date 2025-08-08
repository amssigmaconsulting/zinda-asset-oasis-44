import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AgentWelcomeEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: AgentWelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to agent: ${name} (${email})`);

    const emailResponse = await resend.emails.send({
      from: "PropertyHub <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to PropertyHub - Agent Account Created!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Welcome to PropertyHub, ${name}!
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Congratulations! Your agent account has been successfully created.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">What's Next?</h2>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Complete your profile to showcase your expertise</li>
              <li>Start creating property listings for your clients</li>
              <li>Connect with potential buyers and sellers</li>
              <li>Access our agent dashboard for insights and tools</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Please check your email for account verification and follow the instructions to complete your setup.
          </p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${Deno.env.get('SUPABASE_URL') || 'http://localhost:3000'}/agent-dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Welcome to the PropertyHub agent network!<br>
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-agent-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);