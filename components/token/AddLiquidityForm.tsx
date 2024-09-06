import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { addLiquidity } from '@/lib/token';
import Toast from '../Toast';
import { useWallet } from '@/context/WalletContextProvider';

interface AddLiquidityProps {
    tokenAddress: string;
    signer?: ethers.Signer | null;
}

const AddLiquidityForm: React.FC<AddLiquidityProps> = ({ tokenAddress, signer }) => {
    const {isContractOwner} = useWallet();
    const [tokenAmount, setTokenAmount] = useState<string>('');
    const [ethAmount, setEthAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [mustOneETH, setMustOneETH] = useState<string>('');

    const handleAddLiquidity = async () => {
        if (signer && tokenAddress && tokenAmount && ethAmount) {
            setLoading(true);

            try {
                const tx = await addLiquidity(
                    tokenAddress,
                    ethers.parseUnits(tokenAmount, 18),
                    ethers.parseEther(ethAmount),
                    signer
                );
                await tx.wait();

                // Show success toast
                setToast({ message: 'Liquidity added successfully!', type: 'success' });

                // Wait for 3 seconds before reloading
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (err) {
                console.error('Failed to add liquidity:', err);

                // Show error toast
                setToast({ message: 'Failed to add liquidity. Please try again.', type: 'error' });
            } finally {
                setLoading(false);
            }
        } else {
            // Handle case where input is missing or invalid
            setToast({ message: 'Please enter valid amounts.', type: 'error' });
        }
    };

    useEffect(() => {
        if (Number(ethAmount) < 1 ) {
            setMustOneETH("Must send minimum 1 ETH to initialize");
        }
    },[ethAmount])

    return (
        <div className="p-4 mx-2 w-full bg-white text-gray-700 rounded-t-3xl">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="mb-4">
                <label className="block mb-2" htmlFor="tokenAmount">
                    Token Amount
                </label>
                <input
                    type="text"
                    id="tokenAmount"
                    name="tokenAmount"
                    value={tokenAmount}
                    disabled={loading || !isContractOwner}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="w-full focus:outline-none text-gray-500 p-2 border border-gray-300 rounded-xl"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2" htmlFor="ethAmount">
                    ETH Amount
                </label>
                <input
                    type="text"
                    id="ethAmount"
                    name="ethAmount"
                    value={ethAmount}
                    disabled={loading || !isContractOwner}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full focus:outline-none text-gray-500 p-2 border border-gray-300 rounded-xl"
                />
            </div>
            <button
                onClick={handleAddLiquidity}
                disabled={loading || !isContractOwner || Number(ethAmount) < 1}
                className={`w-full py-2 rounded-xl ${loading || !isContractOwner ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold`}
            >
                {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
            </button>
            <p className="pt-2 text-red-600 font-semibold">{mustOneETH}</p>
        </div>
    );
};

export default AddLiquidityForm;
