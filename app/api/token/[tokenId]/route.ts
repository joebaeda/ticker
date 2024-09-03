import { NextResponse } from "next/server";
import { TickerToken } from "@/contracts/TickerToken";
import { ethers } from 'ethers';

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
    const contractAddress = params.tokenId;

    try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        const contract = new ethers.Contract(contractAddress, TickerToken, provider)

        const tName = await contract.name();
        const tSymbol = await contract.symbol();
        const tSupply = await contract.totalSupply();
        const priceInWei = await contract.getTokenPrice();
        const tPrice = ethers.formatEther(priceInWei);
        const marketCap = parseFloat(String(Number(ethers.formatEther(priceInWei)) * Number(ethers.formatEther(tSupply)))).toFixed(3)

        return NextResponse.json({
            tName,
            tSymbol,
            tPrice,
            marketCap
        });
    } catch (error) {

        return NextResponse.json({
            error: 'Failed to fetch token data',
        }, { status: 500 });
    }
}
