import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Volt Core",
  description: "A modern financial management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
