"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ethers, Signer } from 'ethers';
import { useRouter } from 'next/navigation';
import { isTokenCreator, listTokens } from '@/lib/tokenFactory';
import { tokenCreator } from '@/lib/token';

interface WalletContextProps {
    signer: Signer | null;
    address: string;
    balances: string;
    isCorrectNetwork: boolean;
    isNoWallet: boolean;
    isContractOwner: boolean;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [signer, setSigner] = useState<Signer | null>(null);
    const [address, setAddress] = useState<string>('');
    const [balances, setBalances] = useState<string>('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
    const [isNoWallet, setIsNoWallet] = useState<boolean>(false);
    const [isContractOwner, setIsContractOwner] = useState<boolean>(false);
    const router = useRouter();

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            setIsNoWallet(true);
            return;
        }

        if (window.ethereum && !signer) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const network = await provider.getNetwork();

                if (network.chainId === BigInt(11155111)) { // Sepolia network chainId
                    const signer = await provider.getSigner();
                    const userAddress = await signer.getAddress();
                    const userBalances = await provider.getBalance(userAddress);
                    setSigner(signer);
                    setAddress(userAddress);
                    setIsCorrectNetwork(true);
                    setIsNoWallet(false);
                    setBalances(ethers.formatEther(userBalances));

                    console.log(`Connected with address: ${userAddress}`);

                    // Check if the user is the token creator
                    const isCreator = await isTokenCreator(userAddress);
                    if (isCreator) {
                        const tokens = await listTokens();
                        for (const tokenContractAddress of tokens) {
                            const isOwner = await tokenCreator(tokenContractAddress);
                            if (isOwner === userAddress) {
                                setIsContractOwner(true)
                                router.push(`/token/${tokenContractAddress}`);
                                break;
                            }
                        }
                    }
                } else {
                    setIsCorrectNetwork(false);
                    setIsNoWallet(false);
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                setIsNoWallet(true);
            }
        }
    }, [signer, router]);

    const disconnectWallet = useCallback(() => {
        setSigner(null);
        setAddress('');
        setBalances('')
        setIsCorrectNetwork(false);
        setIsNoWallet(false);
        setIsContractOwner(false);
    }, []);

    useEffect(() => {
        if (!signer) {
            connectWallet();
        }
    }, [connectWallet, signer]);

    return (
        <WalletContext.Provider value={{ signer, address, balances, isCorrectNetwork, isNoWallet, isContractOwner, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
