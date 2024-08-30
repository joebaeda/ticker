import { NextResponse } from "next/server";
import { TickerToken } from "@/contracts/TickerToken";
import { ethers } from 'ethers';

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
    const contractAddress = params.tokenId;

    try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        const contract = new ethers.Contract(contractAddress, TickerToken, provider)

        const symbol = await contract.symbol();
        const priceInWei = await contract.getTokenPrice();
        const price = ethers.formatEther(priceInWei);

        return NextResponse.json({
            symbol,
            price,
        });
    } catch (error) {

        return NextResponse.json({
            error: 'Failed to fetch token data',
        }, { status: 500 });
    }
}
