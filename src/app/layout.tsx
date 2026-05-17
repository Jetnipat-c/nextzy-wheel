import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Kanit } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Nextzy Wheel",
  description: "เกมสะสมคะแนน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-100">
        <div className="max-w-[500px] mx-auto min-h-screen bg-white">
          <Providers>{children}</Providers>
          <Toaster position="top-center" richColors />
        </div>
      </body>
    </html>
  );
}
