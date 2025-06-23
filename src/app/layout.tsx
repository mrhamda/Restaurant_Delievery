import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";


<script
  src="https://kit.fontawesome.com/f5d0802a55.js"
  crossOrigin="anonymous"
></script>;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <CartProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#F9F5F3] via-[#F9F5F3] to-[#F9F5F3] flex flex-col min-h-screen`}
        >
          <Navbar />

          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </CartProvider>
  );
}
