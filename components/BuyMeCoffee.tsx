import { useState, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';

interface BuyMeCoffeeProps {
    isOpen: boolean;
    onClose: () => void;
}

const BuyMeCoffee: React.FC<BuyMeCoffeeProps> = ({ isOpen, onClose }) => {
    const [ethAmount, setEthAmount] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEthAmount(e.target.value);
    };

    const sendETH = async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const tx = await (await signer).sendTransaction({
                to: '0x4fc85b537adc18Ff354a32C6E13BBDcDd94a6D01',
                value: ethers.parseEther(ethAmount),
            });
            console.log('Transaction sent:', tx);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 m-6 w-full max-w-md text-center">
                {/* Funny Image at the Top Center */}
                <Image
                    src="/buymeacoffee.jpeg"
                    alt="Ticker"
                    width={500}
                    height={500}
                    className="rounded-lg"
                    loading="eager"
                    priority={true}
                />

                {/* Thank You Message */}
                <p className="text-gray-600 mb-4 pt-4">Thank you for your support! Every cup helps.</p>

                <input
                    type="text"
                    name="ethAmount"
                    placeholder="0.005"
                    value={ethAmount}
                    onChange={handleChange}
                    className="border border-gray-300 p-3 placeholder:opacity-25 rounded-xl w-full mb-4 hover:outline-none"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex flex-row gap-2 justify-between items-center">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={sendETH}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyMeCoffee;
