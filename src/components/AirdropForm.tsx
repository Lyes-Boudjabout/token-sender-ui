"use client"

import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { ChangeEvent, useMemo, useState } from "react";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import calculateTotalAmounts from "@/utils/calculateTotalAmount/calculateTotalAmount";
import calculateTotalAmountInTokens from "@/utils/calculateTotalAmountInTokens/calculateTotalAmountInTokens";

export default function AirDropForm() {
    const [mode, setMode] = useState('safe');
    const [isSafe, setIsSafe] = useState(true);
    const [isWarning, setIsWarning] = useState(false);
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const [totalAmount, setTotalAmount] = useState("0");
    const [tokenName, setTokenName] = useState("TOKEN");
    const [amountInToken, setAmountInToken] = useState("0.0000");
    const total: string = useMemo(() => calculateTotalAmounts(amounts), [amounts])
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const { data: hash, isPending, writeContractAsync } = useWriteContract();

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if(!tSenderAddress) {
            alert("No address found, please use a supported chain");
            return 0;
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })
        return response as number;
    }

    async function handleSendTokens(e: React.FormEvent) {
        e.preventDefault();
        const recipientsArray = recipients.split(/[\n,]+/).map(addr => addr.trim()).filter(Boolean);
        const amountsArray = amounts.split(/[\n,]+/).map(amt => amt.trim()).filter(Boolean);
        if(tokenAddress === "" || recipientsArray.length === 0 || amountsArray.length === 0 || recipientsArray.length !== amountsArray.length) {
            setIsWarning(true)
            return;
        }
        
        const tSenderAddress: string = chainsToTSender[chainId].tsender;
        const approvedAllowance: number = await getApprovedAmount(tSenderAddress);
        
        if (approvedAllowance < Number(total)) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)]
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })
            console.log("Approval confirmed", approvalReceipt)
        }

        console.log("total", total)
        
        const result = await writeContractAsync({
            abi: tsenderAbi,
            address: tSenderAddress as `0x${string}`,
            functionName: 'airdropERC20',
            args: [
                tokenAddress, 
                recipientsArray,
                amountsArray,
                BigInt(total)
            ]
        })

        console.log("Transaction processed", result)

        /* setTokenAddress("");
        setRecipients("");
        setAmounts("");
        setTotalAmount(calculateTotalAmounts("0")); */
    }

    return (
        <form 
            onSubmit={(e: React.FormEvent) => handleSendTokens(e)} 
            className={`flex flex-col gap-4 w-full max-w-xl border rounded-md p-5 shadow-xl ${mode === 'safe' ? 'shadow-blue-600 border-blue-600' : 'shadow-red-600 border-red-600'} backdrop-blur-2xl`}
        >
            {/* Container Header */}
            <div className="mb-2 flex items-center justify-between rounded px-6 py-3 w-full">
                <h1 className="text-2xl font-semibold text-gray-800">
                    TSender
                </h1>
                <div className="flex space-x-0 border border-gray-300 rounded-0">
                    <button
                        type="button"
                        onClick={() => {setMode('safe'); setIsSafe(true)}}
                        className={`px-4 py-2 rounded-0 text-sm font-medium transition-all duration-200 ${
                            mode === 'safe'
                            ? 'bg-gray-600 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Safe Mode
                    </button>

                    <button
                        type="button"
                        onClick={() => {setMode('unsafe'); setIsSafe(false)}}
                        className={`px-4 py-2 rounded-0 text-sm font-medium transition-all duration-200 ${
                            mode === 'unsafe'
                            ? 'bg-gray-600 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Unsafe Mode
                    </button>
                </div>
            </div>
            {/* Token Address */}
            <div className="mb-2">
                <label 
                    htmlFor="tokenAddressInput" 
                    className="mb-2 text-sm font-medium text-gray-700"
                >
                    Token Address
                </label><br/>
                <input 
                    type="text" 
                    placeholder="0x" 
                    id="tokenAddressInput" 
                    className="border border-gray-300 rounded-md w-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:backdrop-blur-md"
                    value={tokenAddress}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTokenAddress(e.target.value);
                        setIsWarning(false);
                        switch (e.target.value) {
                            case "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512":
                                setTokenName("MT")
                                setAmountInToken(calculateTotalAmountInTokens(calculateTotalAmounts(amounts), "MT"))
                                break;
                            default:
                                setTokenName("TOKEN")
                                break;
                        }
                    }}
                />
            </div>
            {/* Recipients */}
            <div className="mb-2">
                <label 
                    htmlFor="recipientsInput"
                    className="block mb-2 text-sm font-medium text-gray-700"
                >
                    Recipients (comma or new line separated)
                </label>
                <textarea
                    id="recipientsInput"
                    placeholder="0x123..., 0x456..."
                    className="border border-gray-300 rounded-md w-full h-[150px] px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                    value={recipients}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setRecipients(e.target.value);
                        setIsWarning(false)
                    }}
                />
            </div>
            {/* Amounts */}
            <div className="mb-2">
                <label 
                    htmlFor="amountsInput" 
                    className="block mb-2 text-sm font-medium text-gray-700"
                >
                    Amounts (wei; comma or new line separated)
                </label>
                <textarea
                    id="amountsInput"
                    placeholder="100, 200, 300..."
                    className="border border-gray-300 rounded-md w-full h-[150px] px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                    value={amounts}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setAmounts(e.target.value)
                        setTotalAmount(calculateTotalAmounts(e.target.value));
                        setAmountInToken(calculateTotalAmountInTokens(calculateTotalAmounts(e.target.value), tokenName))
                        setIsWarning(false)
                    }}
                />
            </div>
            {/* Transaction Details */}
            <div className="border border-gray-300 rounded-md p-4">
                <p className="text-base font-semibold mb-2">Transaction Details</p>
                {/* Token Name */}
                <div className="flex justify-between w-full">
                    <label 
                        htmlFor="tokenName"
                        className="text-sm font-normal text-gray-800 w-full"
                    >
                        Token Name: 
                    </label>
                    <p 
                        id="tokenName"
                        className="font-mono"
                    >
                        {tokenName}    
                    </p><br/>
                </div>
                {/* Total Amount in Wei */}
                <div className="flex justify-between w-full">
                    <label 
                        htmlFor="amountInWei" 
                        className="text-sm font-normal text-gray-800 w-full"
                    >
                        Amount (wei): 
                    </label>
                    <p 
                        id="amountInWei"
                        className="font-mono"
                    >
                        {totalAmount}
                    </p><br/>
                </div>
                {/* Total Amount in Tokens */}
                <div className="flex justify-between w-full">
                    <label 
                        htmlFor="amountInTokens" 
                        className="text-sm font-normal text-gray-800 w-full"
                    >
                            Amount (tokens): 
                    </label>
                    <p
                        id="amountInTokens"
                        className="font-mono"
                    >
                        {amountInToken}    
                    </p><br/>
                </div>
            </div>
            {/* Warning Message for Unsafe Mode */}
            {!isSafe &&
                <div className="flex items-center space-x-2 text-red-600">
                    <svg 
                        stroke="currentColor" 
                        fill="currentColor" 
                        strokeWidth="0" 
                        viewBox="0 0 24 24" 
                        height="20" 
                        width="20" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM10.9999 16.0002V18.0002H12.9999V16.0002H10.9999ZM10.9999 9.00017V14.0002H12.9999V9.00017H10.9999Z"></path>
                    </svg>
                    <p>Using <span className="underline">unsafe</span> super gas optimized mode</p>
                </div>
            }
            {isWarning &&
                <div className="flex items-center space-x-2 text-red-600">
                    <p>&#x26D4; Please fill properly in the fields before submiting !</p>
                </div>
            }
            {/* Send Token Button */}
            <button 
                type="submit"
                className={`w-full mt-4 border rounded-md p-3 bg-blue-600 border-blue-600 text-white  mix-blend-normal cursor-pointer ${mode === 'safe' ? "bg-blue-600 border-blue-600" : "bg-red-600 border-red-600"}`} 
                onClick={handleSendTokens}
            >
                {mode === 'safe' ? "Send Tokens" : "Send Tokens (Unsafe)"}
            </button>
        </form>
    )
}
