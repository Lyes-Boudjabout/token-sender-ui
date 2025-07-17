"use client"

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, anvil, zksync, sepolia } from "wagmi/chains";

export default getDefaultConfig({
    appName: 'TSender',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    chains: [mainnet, sepolia, polygon, optimism, arbitrum, base, zksync, anvil],
    ssr: false,
})