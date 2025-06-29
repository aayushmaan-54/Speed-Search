import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://speed-search-app.vercel.app"),
  title: {
    default: "Speed Search - Global Edge Search",
    template: "Speed Search | %s",
  },
  description:
    "⚡ Speed Search: A high-performance, edge-based search API showcasing real-time speed comparisons between Redis and PostgreSQL.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
  twitter: {
    card: "summary_large_image",
    title: "⚡ Speed Search - Global Edge Search",
    description:
      "Experience ultra-low latency searches powered by Cloudflare Workers and global Redis. Compare performance with PostgreSQL.",
  },
  keywords: [
    "Speed Search",
    "Edge Computing",
    "Cloudflare Workers",
    "Hono",
    "Upstash Redis",
    "PostgreSQL",
    "Global Search",
    "Low Latency",
    "High Performance",
    "Serverless",
    "Edge API",
    "Real-time Search",
    "Distributed Database",
    "Next.js",
    "Web Performance",
    "Cloudflare",
    "Redis Search",
    "Performance Comparison",
    "Scalable Search",
    "Distributed System",
    "Modern Architecture",
  ],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          ${geistMono.className}
          antialiased`
        }
      >
        {children}
      </body>
    </html>
  );
}
