import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TSender",
  description: "Generated by create next app",
  icons: {
    icon: '/T-Sender.svg',
  },
};

export default function RootLayout(props: {children: ReactNode}) {
  return (
    <html lang="en">
      <body className="h-full font-sans">
        <Providers>
          <Header/>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
