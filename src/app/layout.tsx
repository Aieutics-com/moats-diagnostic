import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8 Moats Diagnostic — Aieutics",
  description:
    "Probe the gap between claimed and evidenced defensibility. A self-assessment for founders and analysts using Gokul Rajaram's 8 Moats framework.",
  openGraph: {
    title: "8 Moats Diagnostic — Aieutics",
    description:
      "Surface the say/do gap in your moat narrative across data, workflow, regulatory, distribution, ecosystem, network, physical infrastructure, and scale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Almarai:wght@300;400;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
