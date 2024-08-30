import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    buy,
    sell,
    tokenNames,
    tokenSymbols,
    totalTokenSupply,
    tokenPriceInETH,
    ethPriceInToken,
    tokenReserveAmount,
    ethReserveAmount,
    tokenBalance,
    tokenCreator
} from '@/lib/token';
import Toast from '../Toast';
import AddLiquidityForm from './AddLiquidityForm';
import CryptoJS from 'crypto-js';

interface SwapProps {
    tokenAddress: string;
    signer?: ethers.Signer | null;
    addressConnected: string;
    addressBalances: string;
}

const generateColorFromToken = (tokenAddress: string): string => {
    const hash = CryptoJS.SHA256(tokenAddress).toString();
    return `#${hash.substring(0, 6)}`;
  };

const SwapForm: React.FC<SwapProps> = ({ tokenAddress, signer, addressConnected, addressBalances }) => {
    const [amount, setAmount] = useState<string>('');
    const [swapType, setSwapType] = useState<'buy' | 'sell'>('buy');
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [tokenColor, setTokenColor] = useState<string>('');
    const [contractCreator, setContractCreator] = useState<string>('');
    const [totalSupply, setTotalSupply] = useState<string>('');
    const [ethPrice, setEthPrice] = useState<string | null>(null);
    const [tokenPrice, setTokenPrice] = useState<string | null>(null);
    const [feeOnEth, setFeeOnEth] = useState<string | null>(null);
    const [feeOnToken, setFeeOnToken] = useState<string | null>(null);
    const [ethMinAmountOut, setETHMinAmountOut] = useState<string | null>(null);
    const [tokenMinAmountOut, setTokenMinAmountOut] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showAddLiquidity, setShowAddLiquidity] = useState<boolean>(false);
    const [tokenBalances, setTokenBalance] = useState<string>('');

    useEffect(() => {
        const fetchTokenData = async () => {
            if (tokenAddress) {
                try {
                    const name = await tokenNames(tokenAddress);
                    const symbol = await tokenSymbols(tokenAddress);
                    const creator = await tokenCreator(tokenAddress);
                    const supplyInWei = await totalTokenSupply(tokenAddress);
                    const supply = ethers.formatEther(supplyInWei);
                    const tokenOwnedWei = await tokenBalance(tokenAddress, addressConnected);
                    const tokenOwned = ethers.formatEther(tokenOwnedWei);
                    const tokenFixedOwn = parseFloat(tokenOwned) * 99 / 100;
                    setTokenName(name);
                    setTokenSymbol(symbol);
                    setContractCreator(creator);
                    setTotalSupply(supply);
                    setTokenBalance(tokenFixedOwn.toString());

                    const reserveToken = await tokenReserveAmount(tokenAddress);
                    const reserveETH = await ethReserveAmount(tokenAddress);

                    if (reserveToken === BigInt(0) && reserveETH === BigInt(0)) {
                        setEthPrice("0");
                        setTokenPrice("0");
                        setShowAddLiquidity(true)
                    } else {
                        const priceInETH = await tokenPriceInETH(tokenAddress);
                        const priceInToken = await ethPriceInToken(tokenAddress);
                        setEthPrice(ethers.formatEther(priceInETH));
                        setTokenPrice(ethers.formatEther(priceInToken));
                        setShowAddLiquidity(false)
                    }
                } catch (err) {
                    console.error('Failed to fetch token data:', err);
                }
            }
        };

        fetchTokenData();
    }, [tokenAddress, addressConnected]);

    useEffect(() => {
        const estimateAmountOut = async () => {
            if (!amount || !ethPrice || !tokenPrice) return;

            try {
                // Convert amounts to Number for precise calculations
                const ethAmount = parseFloat(amount);
                const tokenAmount = parseFloat(amount);
                const priceInEth = parseFloat(ethPrice);
                const priceInToken = parseFloat(tokenPrice);

                if (swapType === 'buy') {
                    // Calculate tokens out for the given ETH amount
                    const tokensOut = ethAmount / priceInEth;
                    const tokensMinOut = tokensOut * 95 / 100; // Apply slippage
                    const feeEth = ethAmount * 0.3 / 100; // Aplly fee for development

                    // Convert to readable format
                    setTokenMinAmountOut(tokensMinOut.toString());
                    setFeeOnEth(feeEth.toString());
                } else if (swapType === 'sell') {
                    // Calculate ETH out for the given token amount
                    const ethOut = tokenAmount / priceInToken;
                    const ethMinOut = ethOut * 85 / 100; // Apply slippage
                    const feeToken = tokenAmount * 0.3 / 100 // Apply fee for development

                    // Convert to readable format
                    setETHMinAmountOut(ethMinOut.toString());
                    setFeeOnToken(feeToken.toString());
                }
            } catch (err) {
                console.error('Failed to estimate amount out:', err);
            }
        };

        estimateAmountOut();
    }, [amount, swapType, ethPrice, tokenPrice]);

    useEffect(() => {
        if (tokenAddress) {
          const color = generateColorFromToken(tokenAddress);
          setTokenColor(color);
        }
      }, [tokenAddress]);

    const handleSwap = async () => {
        if (!signer || !tokenAddress) return;

        const ethAmount = ethers.parseEther(amount);
        const tokenAmount = ethers.parseUnits(amount, 18);
        setLoading(true);

        try {
            if (swapType === 'buy') {
                // Calculate 5% of the total supply
                const tenPercentOfSupply = parseFloat(totalSupply) * 5 / 100;

                // Calculate price in ETH for 5% token supply
                const maxETHAmount = tenPercentOfSupply / parseFloat(tokenPrice as string);
                const ethMaxBuy = maxETHAmount * 75 / 100;

                // Check if the purchase exceeds 5% of the total supply
                if (ethAmount > ethers.parseEther(ethMaxBuy.toString())) {
                    setToast({
                        message: `The purchase amount exceeds 5% of the total supply. You can buy up to ${parseFloat(ethMaxBuy.toString()).toFixed(5)} ETH).`,
                        type: 'error',
                    });
                    setLoading(false);
                    return;
                }

                await buy(tokenAddress, ethers.parseEther(tokenMinAmountOut as string), ethAmount, signer);
            } else if (swapType === 'sell') {
                await sell(tokenAddress, tokenAmount, ethers.parseEther(ethMinAmountOut as string), signer);
            }

            // Show success toast
            setToast({ message: 'Swap successful!', type: 'success' });

            // Wait for 3 seconds before reloading
            setTimeout(() => {
                setLoading(false);
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Swap failed:', error);

            // Show error toast
            setToast({ message: 'Swap failed. Please try again.', type: 'error' });

            // Stop loading after showing the error
            setLoading(false);

            // Optionally wait before removing the toast
            setTimeout(() => {
                setToast(null);
            }, 3000);
        }
    };


    return (
        <div className="px-4 max-w-full flex flex-col gap-4 text-gray-100 md:flex-row items-center">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Token Info */}
            <div className="px-2 text-lg text-gray-200 pt-8 lg:m-0">
                {showAddLiquidity ? (
                    <p> The ticker is <span className="text-2xl font-bold">${tokenSymbol}</span> but unfortunately <span className="text-2xl font-bold">${tokenSymbol}</span> token cannot be traded yet because there is not enough liquidity&#33;</p>
                ) : (
                    <p> Swap with confidence&#44; enjoy unbeatable security&#44; and join the exclusive <span className="text-2xl font-bold text-lime-600">${tokenSymbol}</span> club&#44; where every trade is a move in the ultimate token dance-off&#33;</p>
                )}
                <div className="flex flex-row gap-3 py-8 items-center">
                    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect rx="20" width="100%" height="100%" fill={tokenColor} />
                        <text fontWeight="bold" x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="30" fill="#c8cbcf">
                            ${tokenSymbol}
                        </text>
                    </svg>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold">Created by</h2>
                        <a href={`https://sepolia.etherscan.io/address/${contractCreator.toLocaleLowerCase()}`} target="_blank" className="text-lg text-green-400">{contractCreator.slice(0, 12).toLowerCase()}</a>
                    </div>
                </div>
            </div>
            {/* Swap Form */}
            {showAddLiquidity ? (
                <AddLiquidityForm tokenAddress={tokenAddress} signer={signer} />
            ) : (
                    <div className="p-4 mx-2 w-full bg-white text-gray-700 rounded-t-3xl">
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                {swapType === 'buy' ? 'ETH Amount' : `${tokenSymbol} Amount`}
                            </label>
                            <input
                                type="text"
                                value={amount}
                                id="amount"
                                name="amount"
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                disabled={loading}
                                className="w-full focus:outline-none text-gray-500 p-2 border border-gray-300 rounded-xl"
                            />
                        </div>

                        <div className="mb-5 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Price {swapType === 'buy' ? `1 ETH = ${parseFloat(tokenPrice as string).toFixed(0) || '0'} ${tokenSymbol}` : `1 ${tokenSymbol} = ${parseFloat(ethPrice as string).toFixed(7) || '0'} ETH`}</span>
                            <button
                                onClick={() => setSwapType(swapType === 'buy' ? 'sell' : 'buy')}
                                className="text-blue-500 hover:text-blue-700"
                                disabled={loading}
                            >
                                {swapType === 'buy' ? 'Switch to Sell' : 'Switch to Buy'}
                            </button>
                        </div>

                        <button
                            onClick={handleSwap}
                            className={`w-full p-2 rounded-xl ${loading ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : swapType === 'buy' ? `Buy ${tokenName}` : `Sell ${tokenName}`}
                        </button>
                        {swapType === 'buy' ? (
                            <>
                                <p className="py-2">Your Balance:<span className="float-right">{parseFloat(addressBalances).toFixed(5)} ETH</span></p>
                                <p className="pb-2">Fee &#40;0.3%&#41;:<span className="float-right">{feeOnEth ? parseFloat(feeOnEth as string).toFixed(5) : '0'} ETH</span></p>
                                <p>{tokenSymbol} Received &#40;Est&#41;:<span className="float-right">{tokenMinAmountOut ? parseFloat(tokenMinAmountOut as string).toFixed(0) : '0'} {tokenSymbol}</span></p>
                            </>
                        ) : (
                            <>
                                <p className="py-2">Your Balance:<span className="float-right">{parseFloat(tokenBalances).toFixed(0)} {tokenSymbol}</span></p>
                                <p className="pb-2">Fee &#40;0.3%&#41;:<span className="float-right">{feeOnToken ? parseFloat(feeOnToken as string).toFixed(0) : '0'} {tokenSymbol}</span></p>
                                <p>ETH Received &#40;Est&#41;:<span className="float-right">{ethMinAmountOut ? parseFloat(ethMinAmountOut as string).toFixed(5) : '0'} ETH</span></p>
                            </>
                        )}
                    </div>
            )}
        </div>
    );
};

export default SwapForm;
