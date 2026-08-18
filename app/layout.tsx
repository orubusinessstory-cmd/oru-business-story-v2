import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import PageViewTracker from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Oru Business Story",
  description: "Discover profitable business ideas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oru Business Story",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <PageViewTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
