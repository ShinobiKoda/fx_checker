import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

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
