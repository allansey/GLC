import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Gracelove Chapel",
    default: "Gracelove Chapel | A Place of Grace and Love",
  },
  description: "Welcome to Gracelove Chapel. Reaching out with the Gospel of Grace and Love, raising believers to be relevant and excellent in their generation.",
  keywords: ["Gracelove Chapel", "Church in Kumasi", "KNUST Church", "Ayeduase Church", "Christian Worship", "Sermons", "Ghana Church"],
  authors: [{ name: "Gracelove Chapel" }],
  openGraph: {
    title: "Gracelove Chapel",
    description: "Welcome to Gracelove Chapel - Reaching out with the Gospel of Grace and Love.",
    url: "https://gracelovechapel.com",
    siteName: "Gracelove Chapel",
    images: [
      {
        url: "/assets/images/faith.jpg",
        width: 1200,
        height: 630,
        alt: "Gracelove Chapel Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gracelove Chapel",
    description: "Welcome to Gracelove Chapel - Reaching out with the Gospel of Grace and Love.",
    images: ["/assets/images/faith.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans flex min-h-screen flex-col`}
      >
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <NavbarWrapper />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
        <WhatsAppButton />
      </body>
    </html>
  );
}
