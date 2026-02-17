import type { Metadata } from "next";
import "./globals.css";
import { Baloo } from "./fonts";
import Header from "@/components/header/Header";


export const metadata: Metadata = {
  title: "Bahman Sabz | Frontend Test",
  description: "Bahman Sabz | Frontend Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" suppressHydrationWarning>
      <body
        className={`${Baloo.className} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
