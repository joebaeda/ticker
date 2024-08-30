import React from 'react';

const NoWalletDetected: React.FC = () => {
    const isWalletInstalled = typeof window.ethereum !== 'undefined';

    if (isWalletInstalled) {
        return null; // Don't render anything if the wallet is installed
    }

    return (
        <div className="p-6 fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
            <div className="p-8 max-w-md relative">
                <div className="mb-6">
                    <h1 className="text-5xl font-extrabold text-slate-950 mb-4">ticker is fully onchain</h1>
                    <h2 className="text-3xl font-extrabold text-red-600 tracking-wide">no wallet installed</h2>
                    <p className="mt-2 text-gray-600">
                        It seems you don&#39;t have a crypto wallet installed. To continue, please download and install a wallet like MetaMask.
                    </p>
                </div>
                <div className="flex flex-col-2 gap-2 text-center">
                    <a
                        href="https://metamask.io/download.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded shadow-md transform hover:scale-105 transition duration-300"
                    >
                        Download MetaMask
                    </a>
                    <a
                        href="https://www.walletconnect.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-2 px-6 rounded shadow-md transform hover:scale-105 transition duration-300"
                    >
                        Other Wallets
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NoWalletDetected;
