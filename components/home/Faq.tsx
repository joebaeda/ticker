import { useState } from "react";

const faqs = [
    {
        question: "What is Ticker Token?",
        answer:
            "Ticker Token is an ERC-20 token with a built-in Automated Market Maker (AMM) that allows for automatic price determination between ETH and the token, similar to Uniswap.",
    },
    {
        question: "How do I initialize liquidity?",
        answer:
            "To initialize liquidity, the token creator must call the Add Liquidity button with a positive amount of ETH and tokens. This will set the initial reserves for the ETH and tokens.",
    },
    {
        question: "How do I swap ETH for tokens?",
        answer:
            "To swap ETH for tokens, you can call the Buy button with the amount of ETH you wish to swap. The contract will calculate the equivalent amount of tokens and transfer them to you after collecting a 0.3% fee.",
    },
    {
        question: "How do I swap tokens for ETH?",
        answer:
            "To swap tokens for ETH, you can call the Sell button with the amount of tokens you wish to swap. The contract will calculate the equivalent amount of ETH and transfer it to you after collecting a 0.3% fee.",
    },
    {
        question: "How are fees collected and handled?",
        answer:
            "Fees are collected during swaps (0.3% of the input amount). The contract can later swap these collected token fees for ETH, burn the token fees, and send the total ETH amount to the factory contract.",
    },
    {
        question: "How is the price of tokens determined?",
        answer:
            "The price of tokens is determined by the ratio of ETH to tokens in the liquidity pool. The contract uses a constant product formula to ensure that the price reflects supply and demand.",
    },
];

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className="bg-gray-50 p-6 pt-10">
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-4">
                        <button
                            className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
                            onClick={() => handleToggle(index)}
                        >
                            <h3 className="text-lg text-left font-semibold text-gray-800">{faq.question}</h3>
                            <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                    activeIndex === index ? "rotate-180" : "rotate-0"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {activeIndex === index && (
                            <div className="p-4">
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}

                {/* Full Width Button */}
                <div className="flex flex-row gap-3 mt-8">
                    <a
                        href="/whitepaper"
                        target="_blank"
                        className="inline-block w-full px-6 py-3 text-center text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition"
                    >
                        Whitepaper
                    </a>
                    <a
                        href="/token"
                        target="_blank"
                        className="inline-block w-full px-6 py-3 text-center text-white bg-slate-950 rounded-lg hover:bg-slate-800 transition"
                    >
                        Token List
                    </a>
                </div>
        </div>
    );
}
