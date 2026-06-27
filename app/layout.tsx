import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import Image from "next/image";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { CartProvider } from "@/lib/cartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project: Traceback",
  description: "Streetwear brand",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${inter.variable} ${bebas.variable}`}>
      <body className="text-black antialiased">
        {/* Marmo nitido fisso — sfondo continuo di tutto il sito sotto la hero.
            position: fixed + -z-10 → resta immobile mentre il contenuto scorre sopra. */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/marble.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
        <CartProvider>
          <CartPanel />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
