import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResuMatch // Resume diagnostic terminal",
  description:
    "ATS-grade resume analysis. Upload a resume, paste a JD, see the gap — in under 100ms.",
  keywords: ["resume analyzer", "ATS", "resume match", "job application"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${sans.variable}`}
    >
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0f1523",
              border: "1px solid rgba(0, 255, 198, 0.2)",
              color: "#d8dde9",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
