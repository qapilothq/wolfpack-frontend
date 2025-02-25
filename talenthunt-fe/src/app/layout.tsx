import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./custom-components/Navbar";
import ClarityScript from "./ClarityScript";

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
  title: "Wolf-Pack",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  console.log(clarityProjectId);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="flex h-[90vh]">{children}</div>
        {clarityProjectId && (
          <ClarityScript clarityProjectId={clarityProjectId} />
        )}
      </body>
    </html>
  );
}
