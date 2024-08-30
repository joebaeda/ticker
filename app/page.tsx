"use client";
import { useEffect, useState } from 'react';
import { createToken } from '@/lib/tokenFactory';
import { useWallet } from '@/context/WalletContextProvider';
import Toast from '@/components/Toast';
import WrongNetwork from '@/components/WrongNetwork';
import NoWalletDetected from '@/components/NoWalletDetected';
import Feature from '@/components/home/Feature';
import Faq from '@/components/home/Faq';
import BuyMeCoffee from '@/components/BuyMeCoffee';

export default function Home() {
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const { signer, isCorrectNetwork, isNoWallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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

  const handleCreateToken = async () => {
    if (!signer || !isCorrectNetwork) return;
    setLoading(true);

    try {
      await createToken(name, symbol, signer);

      // Show success toast
      setToast({ message: 'Token created!', type: 'success' });

      // Wait for 3 seconds before reloading
      setTimeout(() => {
        setLoading(false);
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Error creating token:', error);
      // Show error toast
      setToast({ message: 'Error creating token!. Please try again.', type: 'error' });

      // Stop loading after showing the error
      setLoading(false);

      // Optionally wait before removing the toast
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className={`${showBlur ? "blur-lg" : "bg-gradient-to-r from-slate-950 via-slate-900 to-gray-900"} flex flex-col`}>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
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

        {/* Home Hero */}
        <div className="relative lg:py-8 px-6 w-full flex flex-col gap-4 text-gray-100 md:flex-row">
          <div className="md:max-w-sm md:pt-6 max-w-md text-lg text-gray-300">
            <p>
              Where we mint tokens with a sprinkle of magic, swap ETH like we're flipping pancakes, and keep your funds safer than a squirrel in a bank vault.
            </p>
            <div className="flex gap-3 pt-8">
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

          {/* Create token Form */}
          {isCorrectNetwork && (
            <div className="lg:max-w-md lg:absolute lg:top-4 lg:right-6 lg:h-64 lg:rounded-b-3xl lg:pt-8 p-4 mx-auto bg-white text-gray-700 rounded-t-3xl">
              <input
                type="text"
                name="token name"
                placeholder="Token Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
                className="w-full mb-4 p-3 placeholder:opacity-25 valid:border-green-500 focus:outline-none border border-gray-300 rounded-2xl text-gray-900"
              />
              <input
                type="text"
                name="token symbol"
                placeholder="Token Symbol"
                maxLength={4}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                disabled={loading}
                required
                className="w-full mb-4 p-3 valid:border-green-500 placeholder:opacity-25 focus:outline-none border border-gray-300 rounded-2xl text-gray-900"
              />
              <button
                onClick={handleCreateToken}
                className={`w-full py-3 rounded-lg ${loading ? 'bg-gray-600' : 'bg-gray-900 hover:bg-slate-950'} text-gray-200 font-bold`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Token'}
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <main>
          <Feature />
          <Faq />
        </main>

        {/* Footer */}
        <footer className="bg-white min-h-80 text-gray-400 pt-4">
          <div className="container mx-auto text-center">
            <p className="text-sm p-6 max-w-2xl mx-auto">
              Investing in cryptocurrencies involves significant risk and can result in the loss of your entire investment. The value of cryptocurrencies is highly volatile and subject to unpredictable market changes. We do not provide financial, investment, or legal advice, and the content on this site is for informational purposes only. Always conduct your own research and consult with a qualified professional before making any financial decisions. We are not responsible for any losses incurred through the use of this site or its content.
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
