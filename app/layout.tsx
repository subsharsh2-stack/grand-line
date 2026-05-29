import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Grand Line — The World for One Piece Fans",
    template: "%s | Grand Line",
  },
  description:
    "Track your One Piece journey. Earn Berries. Climb the bounty boards. Build your crew. The gamified home for every Straw Hat.",
  keywords: ["one piece", "anime", "watch tracker", "gamification", "grand line", "bounty"],
  authors: [{ name: "Grand Line" }],
  openGraph: {
    title: "Grand Line",
    description: "The World for One Piece Fans",
    type: "website",
    siteName: "Grand Line",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grand Line",
    description: "The World for One Piece Fans",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-void-950 text-slate-100 antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0f172a",
                color: "#e2e8f0",
                border: "1px solid rgba(245,166,35,0.3)",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#f5a623", secondary: "#080c14" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
