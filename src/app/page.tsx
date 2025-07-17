"use client"

import AirDropForm from "@/components/AirdropForm";
import RequireConnect from "@/components/RequireConnect";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      {isConnected ? <AirDropForm/> : <RequireConnect/>}
    </main>
  );
}
