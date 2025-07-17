"use client"

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "@/configs/rainbowKitConfig";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: {children: ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())
    
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}