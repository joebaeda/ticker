"use client";

import WrongNetwork from '@/components/WrongNetwork';
import { useWallet } from '@/context/WalletContextProvider';
import NoWalletDetected from '@/components/NoWalletDetected';
import { useEffect, useState } from 'react';
import BuyMeCoffee from '@/components/BuyMeCoffee';

async function fetchPostData(postId: string) {
    const res = await fetch(`https://www.ticker.id/api/blog/${postId}`);
    if (!res.ok) {
        throw new Error('Failed to fetch post data');
    }
    return res.json();
}

async function fetchRelatedPosts(tags: string[]) {
    const res = await fetch('https://www.ticker.id/api/blog/related', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags }),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch related posts');
    }
    return res.json();
}

async function fetchAirdropPosts(tag: string) {
    const res = await fetch('https://www.ticker.id/api/blog/related', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [tag] }),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch related posts');
    }
    return res.json();
}

export default function Posts({ params }: { params: { postId: string } }) {
    const { signer, isCorrectNetwork, isNoWallet } = useWallet();
    const [postData, setPostData] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [airdropPosts, setAirdropPosts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
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

    useEffect(() => {
        fetchPostData(params.postId)
            .then(async (data) => {
                setPostData(data);
                if (data.tags && data.tags.length > 0) {
                    const related = await fetchRelatedPosts(data.tags);
                    setRelatedPosts(related);
                }
            })
            .catch((err) => setError(err.message));
    }, [params.postId]);

    useEffect(() => {
        fetchPostData(params.postId)
            .then(async (data) => {
                setPostData(data);
                if (data.tags && data.tags.length > 0) {
                    const related = await fetchAirdropPosts("Ticker Token");
                    setAirdropPosts(related);
                }
            })
            .catch((err) => setError(err.message));
    }, [params.postId]);

    if (error) {
        return <div className="flex items-center justify-center min-h-screen">
            <img src="/ticker-blog-loading.svg" alt="Loading..." className="w-300 h-full object-contain" />
        </div>;
    }

    if (!postData) {
        return <div className="flex items-center justify-center min-h-screen">
            <img src="/ticker-blog-loading.svg" alt="Loading..." className="w-300 h-full object-contain" />
        </div>;
    }

    return (
        <>
            <div className={`${showBlur ? "blur-lg" : "bg-gradient-to-r from-slate-950 via-slate-900 to-gray-900"} flex flex-col`}>
                {/* Navbar */}
                <nav className="my-5">
                    <div className="px-4">
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

                {/* Feature Image Header */}
                <header className="w-full h-96 bg-cover bg-center" style={{ backgroundImage: `url(${postData.image})` }} />

                {/* Main Content */}
                {isCorrectNetwork && (
                    <div className="bg-gray-100">
                        <div className="flex flex-col lg:flex-row p-4">
                            <main className="flex-1">
                                {/* Post Content */}
                                <article className="prose max-w-xl">
                                    <p className="text-lg lg:text-xl">{postData.date} | {postData.author}</p>
                                    <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
                                </article>
                            </main>
                            {/* Sidebar for Related Posts */}
                            <aside className="lg:w-80 lg:ml-8 mt-10 lg:mt-0">
                                <div className="space-y-4">
                                    {relatedPosts.slice(0, 4).map((post: any) => (
                                        <a href={`/blog/${post.id}`} key={post.id} className="block bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg overflow-hidden shadow-lg">
                                            <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                                            <div className="p-4 text-gray-900">
                                                <p className="text-xs lg:text-md">{post.date} | {post.author}</p>
                                                <h4 className="text-md font-semibold">{post.title}</h4>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </aside>
                        </div>
                        {/* Promoted Posts */}
                        <div className="max-w-5xl py-6">
                            <div className="overflow-x-scroll scrollbar-hide flex space-x-4">
                                {airdropPosts.map((post: any) => (
                                    <a href={`/blog/${post.id}`} key={post.id} className="min-w-[320px] overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                                        <div className="p-4 h-40 text-gray-900 bg-white hover:bg-gray-200 transition-colors">
                                            <p className="text-sm lg:text-md">{post.date} | {post.author}</p>
                                            <h3 className="text-lg font-semibold">{post.title}</h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer content */}
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
