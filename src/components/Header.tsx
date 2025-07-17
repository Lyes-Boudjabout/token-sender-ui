import { FaGithub } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center gap-4">
                <Image
                    src={"/T-Sender.svg"}
                    alt="TSender"
                    width={35}
                    height={35}
                />
                <h1 className="text-2xl font-bold text-gray-600">TSender</h1>
                <a
                    href="https://github.comd/Lyes-Boudjabout/token-sender-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-600 transition-colors"
                >
                    <FaGithub size={24}/>
                </a>
            </div>
            <p>
                <em>The most gas efficient airdrop contract on earth, built in huff 🐎</em>
            </p>
            <ConnectButton/>
        </header>
    )
}
