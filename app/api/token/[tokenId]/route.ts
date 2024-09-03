import { NextResponse } from "next/server";
import { TickerToken } from "@/contracts/TickerToken";
import { ethers } from 'ethers';

export const runtime = "edge";

const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

// Function to fetch token data
async function getTokenData(tokenId: string) {
    try {
        const contract = new ethers.Contract(tokenId, TickerToken, provider);

        // Assuming your contract has these functions to fetch data
        const [tSymbol, tName, tPrice, tSupply] = await Promise.all([
            contract.symbol(), // get the token symbol
            contract.name(), // get the token name
            contract.getTokenPrice(), // get the token price
            contract.totalSupply(),
        ]);

        return {
            tSymbol,
            tName,
            tPrice: parseFloat(ethers.formatEther(tPrice)).toFixed(6), // Convert price to ETH
            marketCap: parseFloat(String(Number(ethers.formatEther(tPrice)) * Number(ethers.formatEther(tSupply)))).toFixed(3), // calculate marketcap
        };
    } catch (error) {
        console.error("Error fetching token data:", error);
        throw new Error("Failed to fetch token data");
    }
}

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
    const contractAddress = params.tokenId;

    try {
        const { tSymbol, tName, tPrice, marketCap } = await getTokenData(contractAddress);

        return NextResponse.json({
            tSymbol,
            tName,
            tPrice,
            marketCap,
        });
    } catch (error) {

        return NextResponse.json({
            error: 'Failed to fetch token data',
        }, { status: 500 });
    }
}
