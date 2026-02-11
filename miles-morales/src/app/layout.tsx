import type { Metadata } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kid Arachnid | Spider-Man — Earth-1610",
  description:
    "The official portfolio of Kid Arachnid — Brooklyn's one and only Spider-Man. Built with cinematic motion.",
  keywords: [
    "Kid Arachnid",
    "Spider-Man",
    "Spider-Verse",
    "Earth-1610",
    "Brooklyn",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} font-body antialiased bg-background text-foreground`}
      >
        <div className="noise-overlay">{children}</div>
      </body>
    </html>
  );
}
