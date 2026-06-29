import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cockroach Janta Party (CJP) | Voice of the Lazy & Unemployed",
  description: "Official website of the Cockroach Janta Party (CJP). Fighting for universal basic naptime, anti-hustle taxation, and the right to remain horizontal. Join the movement that stands for... well, sitting down.",
  keywords: ["Cockroach Janta Party", "CJP", "Lazy and Unemployed", "Political Satire", "Universal Basic Naptime", "Horizontal Living"],
  authors: [{ name: "The Horizontal Committee" }],
  openGraph: {
    title: "Cockroach Janta Party (CJP)",
    description: "Voice of the Lazy & Unemployed. Join the movement that stands for... well, sitting down.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${playfair.variable} ${jakarta.variable} font-sans min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
