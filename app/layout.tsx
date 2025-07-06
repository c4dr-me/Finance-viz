import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BudgetProvider } from "@/hooks/useBudgetContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Finance Visualizer",
  description: "Track your income and expenses with beautiful real-time charts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <BudgetProvider>
          {children}
        </BudgetProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgb(17 24 39)',
              border: '1px solid rgb(75 85 99)',
              color: 'rgb(243 244 246)',
            },
          }}
        />
      </body>
    </html>
  );
}
