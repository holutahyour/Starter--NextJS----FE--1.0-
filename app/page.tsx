"use client";


import { GalleryVerticalEnd } from "lucide-react";
// import loginImage from "";

import Image from "next/image";
// import { LoginForm } from "./sign-in-form";
import AppLogo from "@/components/app/app-logo";
import { Button } from "@chakra-ui/react";
import { FaMicrosoft } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAzureAuth } from "./context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import App from "next/app";
import AppLoader from "./_components/app-loader";
// import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { signIn, isLoading, isAuthenticated } = useAzureAuth();
  const loginImage = "/assets/images/login.jpg"


  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // if(isLoading) {
  //   return(
  //     <AppLoader />
  //   )
  // }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <AppLogo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className={cn("flex flex-col gap-6")}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Login to your account using Microsoft Entra
                </p>
              </div>
              <div className="grid gap-6">
                <Button
                  onClick={() => signIn()}
                  loadingText="Loading"
                  spinnerPlacement="end"
                  type="submit"
                  className="w-full"
                >
                  <FaMicrosoft />
                  Login with Microsoft Account
                </Button>
              </div>
              <div className="text-gray-400 text-center text-sm">
                Built by Onibudo Victor
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden bg-accent lg:grid place-items-center relative h-full w-full">
        <Image
          src={loginImage}
          alt="Image"
          fill
          className="object-cover inset-0 dark:brightness-[0.2] dark:grayscale"
          unoptimized
        />
      </div>
    </div>
  );
}
