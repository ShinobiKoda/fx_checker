import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import { z } from "zod";
import { welcomeEmailRatelimit } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

const payloadSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // Only apply rate limiting if Redis URL is configured (prevents crash in local dev without Upstash)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success: rateLimitSuccess } = await welcomeEmailRatelimit.limit(ip);
      if (!rateLimitSuccess) {
        return NextResponse.json({ 
          success: false, 
          error: "Too many requests. Please try again later." 
        }, { status: 429 });
      }
    }

    const body = await req.json();
    const validatedData = payloadSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ 
        success: false, 
        error: validatedData.error.issues[0].message 
      }, { status: 400 });
    }

    const { email, firstName } = validatedData.data;

    const { data, error } = await resend.emails.send({
      from: "FX Checker <welcome@sir-p.tech>", // Make sure to use your verified domain
      to: email,
      subject: "Welcome to FX Checker",
      react: WelcomeEmail({ userFirstName: firstName }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server catch error:", error);
    
    // Extract meaningful error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' ? error : "An unexpected error occurred";
      
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}
