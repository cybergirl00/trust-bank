import ConvexClientProvider from "@/providers/ConvexClientProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trust Bank",
  description: "The bank you can trust",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <main>
          {children}
          </main>
        <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
