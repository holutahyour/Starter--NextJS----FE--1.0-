"use client"
import { SessionProvider } from "next-auth/react";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./chakra-color-mode"

import "@/app/globals.css";
import { AzureAuthProvider } from "@/context/auth-context";
import { RoleSelectionProvider } from "@/context/roleSelection-context";

const config = defineConfig({
  // globalCss: {
  //   html: {
  //     colorPalette: "#739E73", // Change this to any color palette you prefer
  //   },
  // },
})

export const system = createSystem(defaultConfig, config)

export function Providers(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <SessionProvider>
        <AzureAuthProvider>
          <RoleSelectionProvider>

            <ColorModeProvider defaultTheme="light" {...props} />
          </RoleSelectionProvider>

        </AzureAuthProvider>

      </SessionProvider>
    </ChakraProvider>
  );
}
