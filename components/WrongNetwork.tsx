"use client";

import React from 'react';
import { useWallet } from '@/context/WalletContextProvider'; // Assuming you have a WalletProvider context

const WrongNetwork: React.FC = () => {
    const { isCorrectNetwork } = useWallet();

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia network chainId
            });
            window.location.reload(); // Refresh the page after switching network
        } catch (error) {
            console.error('Failed to switch network:', error);
            // Optional: add more error handling here
        }
    };

    if (isCorrectNetwork) {
        return null; // Don't render anything if the network is correct
    }

    return (
        <div className="p-6 fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="p-8 rounded-lg max-w-md relative">
                <div className="mb-6">
                    <h2 className="text-5xl font-extrabold text-slate-950 tracking-wide">ticker is on sepolia network</h2>
                    <p className="mt-2 text-gray-600">
                        it seems you&#39;re connected to the wrong network. please switch to the sepolia network to continue.
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={switchNetwork}
                        className="w-full bg-gradient-to-r from-slate-950 to-gray-900 hover:from-slate-600 hover:to-gray-900 text-white font-bold py-2 px-6 rounded shadow-md transform hover:scale-105 transition duration-300"
                    >
                        Switch Network
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WrongNetwork;
