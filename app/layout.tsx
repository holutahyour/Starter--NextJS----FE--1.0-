import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import SideNav from "@/components/app/side-nav";
import PageLayout from "@/app/_components/page-layout";
import { Suspense } from "react";
import {  Providers } from "@/components/ui/chakra-provider";

import { Container } from "@chakra-ui/react";
import Loading from "./loading";
import { SIGN_IN, SIGN_UP } from "@/lib/routes";
import { Toaster } from "@/components/ui/chakra-toaster";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Educ8e Connector",
  description: "Educ8e Connector Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
      </head>
      <body
        className={cn(
          "h-dvh bg-white font-inter text-[1.6rem] antialiased ",
          inter.variable
        )}
      >
        {/* <div className="flex flex-col lg:flex-row bg-white max-w-full">
          <section className="bg-educ8_white-1 h-auto lg:h-screen w-full lg:w-[22rem]">
            <SideNav />
          </section>
          <main className="bg-white remove-scrollbar flex-grow overflow-x-hidden">
            <Toaster richColors />
            {children}
          </main>
        </div> */}
        <Providers>
          <Suspense fallback={<Loading />}>
            <Toaster />
            {/* <PageLayout> */}
              {children}
            {/* </PageLayout> */}
          </Suspense>
        </Providers>


      </body>
    </html>
  );
}
