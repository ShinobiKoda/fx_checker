import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstName?: string;
}

export const WelcomeEmail = ({
  userFirstName,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to FX Checker!`;

  return (
    <Html>
      <Head>
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #171717 !important;
                color: #fafafa !important;
              }
              .container {
                background-color: #262626 !important;
                border: 1px solid #404040 !important;
              }
              .text-secondary {
                color: #a3a3a3 !important;
              }
              .heading {
                color: #fafafa !important;
              }
              .footer {
                color: #737373 !important;
              }
              .footer-section {
                border-top: 1px solid #404040 !important;
              }
              .button {
                background-color: #84cc16 !important;
                color: #000000 !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container className="container" style={container}>
          <Section style={header}>
            <Text style={logo}>FX Checker</Text>
          </Section>
          
          <Section style={content}>
            <Heading className="heading" style={heading}>
              Welcome to FX Checker
            </Heading>
            <Text className="text-secondary" style={text}>
              Hi {userFirstName ? userFirstName : "there"},
            </Text>
            <Text className="text-secondary" style={text}>
              Thank you for signing up! We're thrilled to have you on board. FX Checker is designed to provide you with seamless currency conversions, powerful split analytics, and real-time market data—all in one place.
            </Text>
            <Text className="text-secondary" style={text}>
              Ready to explore your dashboard?
            </Text>
            
            <Section style={buttonContainer}>
              <Button
                className="button"
                style={button}
                href="https://fxchecker.com"
              >
                Go to Dashboard
              </Button>
            </Section>
            
            <Text className="text-secondary" style={text}>
              If you have any questions or need assistance, simply reply to this email. We're here to help.
            </Text>
          </Section>

          <Section className="footer-section" style={footerSection}>
            <Text className="footer" style={footerText}>
              © {new Date().getFullYear()} FX Checker. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "12px",
  maxWidth: "560px",
  border: "1px solid #e5e5e5",
  overflow: "hidden",
};

const header = {
  padding: "32px 40px",
  backgroundColor: "#000000",
};

const logo = {
  margin: "0",
  color: "#84cc16", // Lime 500
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "-0.5px",
};

const content = {
  padding: "32px 40px 40px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  color: "#171717",
  margin: "0 0 24px",
};

const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#404040",
  margin: "0 0 16px",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#84cc16", // Lime 500
  borderRadius: "6px",
  color: "#000000",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const footerSection = {
  padding: "24px 40px",
  backgroundColor: "transparent",
  borderTop: "1px solid #e5e5e5",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#737373",
  margin: "0",
  textAlign: "center" as const,
};
