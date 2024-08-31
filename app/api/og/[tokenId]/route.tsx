import { ethers } from 'ethers';
import { ImageResponse } from 'next/og';
import CryptoJS from 'crypto-js';
import { TickerToken } from '@/contracts/TickerToken';

export const runtime = "edge";

const tokenColor = (tokenId: string): string => {
    const hash = CryptoJS.SHA256(tokenId).toString();
    return `#${hash.substring(0, 6)}`;
};

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
    const tColor = tokenColor(contractAddress);

    // Extra bold font
    const extraBoldFont = await fetch(
        new URL("/public/Kanit-ExtraBold.ttf", import.meta.url)
    );

    const regulerFont = await fetch(
        new URL("/public/Kanit-Regular.ttf", import.meta.url)
    );

    if (!extraBoldFont.ok || !regulerFont.ok) {
        throw new Error("Failed to fetch the font file");
    }

    const extraBold = await extraBoldFont.arrayBuffer();
    const reguler = await regulerFont.arrayBuffer();

    try {
        const { tSymbol, tName, tPrice, marketCap } = await getTokenData(contractAddress);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Kanit',
                    }}
                >
                    <div style={{
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1e293b'
                    }}>
                        <div style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    borderTopLeftRadius: '24px',
                                    borderBottomLeftRadius: '24px',
                                    minHeight: '500px',
                                    width: '40%',
                                    backgroundColor: tColor
                                }}>
                                    <h1 style={{
                                        fontSize: '8rem',
                                        fontWeight: '800',
                                        letterSpacing: '-0.025em',
                                        color: '#e2e8f0',
                                        margin: 'auto'
                                    }}>{tSymbol}</h1>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#f1f5f9',
                                    minHeight: '450px',
                                    padding: '35px',
                                    width: '100%'
                                }}>
                                    <h2 style={{
                                        fontSize: '4rem',
                                        fontWeight: '800',
                                        color: tColor
                                    }}>{tName}</h2>
                                    <p style={{
                                        fontSize: '2rem',
                                        fontFamily: 'Reguler'
                                    }}>Price: {tPrice} ETH/{tSymbol}</p>
                                    <p style={{
                                        fontSize: '2rem',
                                        width: '60%',
                                        fontFamily: 'Reguler'
                                    }}>The Marketcap or total value of all Test Token Sepolia combined has reached a staggering {marketCap} ETH.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: "Kanit",
                        data: extraBold,
                        style: "normal",
                    },
                    {
                        name: "Reguler",
                        data: reguler,
                        style: "normal",
                    },
                ],
            }
        );
    } catch (error) {
        console.error("Error generating image response:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
