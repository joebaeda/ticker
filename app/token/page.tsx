"use client";
import { useEffect, useState } from 'react';
import { listTokens } from '@/lib/tokenFactory';
import { tokenReserveAmount, tokenSymbols } from '@/lib/token';
import TokenCard from '@/components/token/TokenCard';
import { useWallet } from '@/context/WalletContextProvider';
import WrongNetwork from '@/components/WrongNetwork';
import NoWalletDetected from '@/components/NoWalletDetected';
import TokensHero from '@/components/token/TokensHero';
import BuyMeCoffee from '@/components/BuyMeCoffee';

export default function Tokens() {
    const [tokens, setTokens] = useState<{ address: string, symbol: string }[]>([]);
    const [filteredTokens, setFilteredTokens] = useState<{ address: string; symbol: string }[]>([]);
    const { signer, isCorrectNetwork, isNoWallet } = useWallet();
    const [totalCreated, setTotalCreated] = useState<number>(0);
    const [haveLiquidity, setHaveLiquidity] = useState<number>(0);
    const [showBlur, setShowBlur] = useState<boolean>(false);

    // BuyMeCoffee
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (!signer) {
            setShowBlur(true);
        } else {
            setShowBlur(false);
        }
    }, [signer]);

    // Effect to fetch tokens when the network is correct
    useEffect(() => {
        const fetchTokens = async () => {
            try {
                if (isCorrectNetwork) {
                    const tokensList = await listTokens();
                    const tokensWithLiquidity = [];
                    const tokenDetails = await Promise.all(
                        tokensList.map(async (tokenAddress: string) => {
                            try {
                                const symbol = await tokenSymbols(tokenAddress);
                                const tokenReserve = await tokenReserveAmount(tokenAddress);
                                if (tokenReserve > BigInt(0)) {
                                    tokensWithLiquidity.push(tokenAddress);
                                }
                                return { address: tokenAddress, symbol };
                            } catch (err) {
                                console.error(`Failed to get details for token at address ${tokenAddress}:`, err);
                                return { address: tokenAddress, symbol: "N/A" };
                            }
                        })
                    );
                    setTokens(tokenDetails);
                    setFilteredTokens(tokenDetails); // Initialize with all tokens
                    setTotalCreated(tokensList.length);
                    setHaveLiquidity(tokensWithLiquidity.length);
                }
            } catch (err) {
                console.error("Failed to fetch tokens:", err);
            }
        };
        fetchTokens();
    }, [isCorrectNetwork]);

    // Handle search query
    const handleSearch = (query: string) => {
        if (!query) {
            setFilteredTokens(tokens); // Show all tokens if the search query is empty or null
        } else {
            const lowercasedQuery = query.toLowerCase();
            const filtered = tokens.filter((token) =>
                token.symbol.toLowerCase().includes(lowercasedQuery) ||
                token.address.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredTokens(filtered);
        }
    };

    return (
        <>
            <div className={`${showBlur ? "blur-lg" : "bg-gradient-to-r from-slate-950 via-slate-900 to-gray-900"} flex flex-col`}>
                {/* Navbar */}
                <nav className="my-5">
                    <div className="px-6">
                        <div className="mx-auto flex justify-between h-16 items-center">
                            <div className="text-5xl font-bold text-white">
                                <a href="/">ticker. <span className="text-lg text-lime-500">beta</span></a>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <a href="https://github.com/joebaeda" target="_blank">
                                    <div aria-label="Github">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                                            fill="none" stroke="#718096" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <path
                                                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
                                            </path>
                                        </svg>
                                    </div>
                                </a>
                                <a href="https://x.com/joebaeda" target="_blank">
                                    <div aria-label="Twitter">
                                        <svg width="22" height="22" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M9.47 6.77 15.3 0h-1.4L8.85 5.88 4.81 0H.15l6.11 8.9L.15 16h1.38l5.35-6.21L11.14 16h4.67L9.47 6.77Zm-1.9 2.2-.61-.88-4.93-7.05h2.12l3.98 5.69.62.88 5.17 7.4h-2.13L7.58 8.97Z" fillRule="nonzero" fillOpacity="1" fill="#718096" stroke="none" strokeWidth="1.5"></path></svg>
                                    </div>
                                </a>
                                <a href="/blog" target="_blank">
                                    <div aria-label="Blog">
                                        <svg width="30" height="30" viewBox="0 3 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 7h4m-4 8h3m-3-4h6m4 0V9c0-2.828 0-4.243-.879-5.121C17.243 3 15.828 3 13 3h-2c-2.828 0-4.243 0-5.121.879C5 4.757 5 6.172 5 9v6c0 2.828 0 4.243.879 5.121C6.757 21 8.172 21 11 21h1" stroke="#718096" strokeLinecap="round" /><circle cx="17.5" cy="17.5" r="2.5" stroke="#718096" strokeLinecap="round" /><path d="m21 21-1.5-1.5" stroke="#718096" strokeLinecap="round" /></svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Token Hero */}
                <TokensHero
                    onSearch={handleSearch}
                    totalTokenCreated={totalCreated}
                    tokenHaveLiquidity={haveLiquidity}
                    tokenFound={filteredTokens.length > 0}
                />

                {/* Main Content */}
                {isCorrectNetwork && (
                    <main className="bg-white rounded-t-3xl items-center justify-center p-6">
                        {/* Token List */}
                        {filteredTokens.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {filteredTokens.map((token, index) => (
                                    <a href={`/token/${token.address}`} target="_blank" key={index} className="shadow-md rounded-xl overflow-hidden transition-transform transform hover:scale-105">
                                        <TokenCard tokenAddress={token.address} symbol={token.symbol} />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col justify-between items-center max-w-lg pt-8 text-gray-600 mx-auto">
                                <svg width={100} height={100} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" xmlSpace="preserve">
                                    <path d="M57 0H3C1.346 0 0 1.346 0 3v56a1 1 0 0 0 1 1h58a1 1 0 0 0 1-1V3c0-1.654-1.346-3-3-3M3 2h54c.551 0 1 .449 1 1v5H2V3c0-.551.449-1 1-1m16 51v5h-8v-5zm2 0h8v5h-8zm10 0h8v5h-8zm10 0h8v5h-8zM2 51V17h56v34zm0-36v-5h56v5zm0 38h7v5H2zm49 5v-5h7v5z" />
                                    <path d="M5 4h4v2H5zm7 0h4v2h-4zm4 20h-2v13H8V24H6v14a1 1 0 0 0 1 1h7v6h2v-6h3v-2h-3zm38 13h-3V24h-2v13h-6V24h-2v14a1 1 0 0 0 1 1h7v6h2v-6h3zM30 24c-3.86 0-7 3.14-7 7v7c0 3.86 3.14 7 7 7s7-3.14 7-7v-7c0-3.86-3.14-7-7-7m5 14c0 2.757-2.243 5-5 5s-5-2.243-5-5v-7c0-2.757 2.243-5 5-5s5 2.243 5 5z" />
                                </svg>
                                <p className="max-w-60 py-5 text-center">Please try searching with a different keyword or check back later.</p>
                            </div>
                        )}
                    </main>
                )}

                {/* Footer content */}
                <footer className="bg-white min-h-80 text-gray-400 pt-4">
                    <div className="container mx-auto text-center">
                        <p className="text-sm p-6 max-w-2xl mx-auto">
                        The value of cryptocurrencies is highly volatile and subject to unpredictable market changes. We do not provide financial, investment, or legal advice. Always conduct your own research and consult with a qualified professional before making any financial decisions. We are not responsible for any losses incurred through the use of this site or its content.
                        </p>
                        <button
                            onClick={openModal}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl"
                        >
                            Buy Me a Coffee
                        </button>

                        <BuyMeCoffee isOpen={isModalOpen} onClose={closeModal} />
                        <div className="mt-4">
                            <p className="text-xs text-gray-500">
                                &copy; {new Date().getFullYear()} ticker. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            {isNoWallet ? (<NoWalletDetected />) : (<WrongNetwork />)}
        </>
    );
}
