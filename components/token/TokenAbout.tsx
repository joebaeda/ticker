import {
    ethReserveAmount,
    tickerContract,
    tickerContractProvider,
    tokenBalance,
    tokenNames,
    tokenPriceInETH,
    tokenReserveAmount,
    tokenSymbols,
    totalTokenSupply
} from '@/lib/token';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

async function fetchAirdropPosts(tag: string) {
    const res = await fetch('/api/blog/related', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [tag] }),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch related posts');
    }
    return res.json();
}

const formatToUSD = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

interface TokenAboutProps {
    contractAddress: string;
}

const TokenAbout: React.FC<TokenAboutProps> = ({ contractAddress }) => {
    const [currentPrice, setCurrentPrice] = useState<string>('');
    const [marketCap, setMarketCap] = useState<string>('');
    const [volume, setVolume] = useState<string>('');
    const [marketcapUSD, setMarketcapUSD] = useState<string>('');
    const [volumeUSD, setVolumeUSD] = useState<string>('');
    const [volumeUSDAllTime, setVolumeUSDAllTime] = useState<string>('');
    const [totalSupply, setTotalSupply] = useState<string>('');
    const [holders, setHolders] = useState<number>(0);
    const [ethReserve, setEthReserve] = useState<string>('');
    const [tokenReserve, setTokenReserve] = useState<string>('');
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [launchDiscover, setLaunchDiscover] = useState<boolean>(false);
    //related article about airdrop
    const [airdropPosts, setAirdropPosts] = useState<any[]>([]);

    const fetchTokenPriceInUSD = async (tokenId: string): Promise<number | null> => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
            if (!response.ok) {
                throw new Error('Failed to fetch token price');
            }
            const data = await response.json();
            const priceInUSD = data[tokenId].usd;
            return priceInUSD;
        } catch (error) {
            console.error('Error fetching token price:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchContractData = async () => {
            const provider = tickerContractProvider();
            const contract = tickerContract(contractAddress);

            try {
                const tName = await tokenNames(contractAddress);
                const tSymbol = await tokenSymbols(contractAddress);
                const supply = await totalTokenSupply(contractAddress);
                const ethReserve = await ethReserveAmount(contractAddress);
                const tokenReserve = await tokenReserveAmount(contractAddress);
                if (tokenReserve > BigInt(0) || ethReserve > BigInt(0)) {
                    setLaunchDiscover(true)
                    const price = await tokenPriceInETH(contractAddress);

                    setCurrentPrice(ethers.formatEther(price));
                    setTokenName(tName);
                    setTokenSymbol(tSymbol);
                    setEthReserve(ethers.formatEther(ethReserve));
                    setTokenReserve(ethers.formatUnits(tokenReserve, 18));
                    setTotalSupply(ethers.formatUnits(supply, 18));

                    // Calculate Market Cap
                    const marketCap = Number(ethers.formatUnits(supply, 18)) * Number(ethers.formatEther(price));
                    setMarketCap(marketCap.toString());

                    // Fetch Volume (last 24 hours)
                    const currentBlock = await provider.getBlockNumber();
                    const blocksPerDay = 24 * 60 * 4; // approx for Ethereum
                    const fromBlock = currentBlock - blocksPerDay;
                    const transferEvents = await contract.queryFilter(contract.filters.Transfer(null, null), fromBlock, currentBlock);
                    const volumeWei = transferEvents.reduce((total: any, event: any) => total + Number(ethers.formatUnits(event.args?.value, 18)), 0);
                    const volumeETH = volumeWei * Number(ethers.formatEther(price));
                    
                    // Set the 24 hours volume
                    setVolume(volumeETH.toString());

                    // Fetch token holders
                    // Query all Transfer events from the genesis block to the current block
                    const filterTokenHolder = await contract.queryFilter(
                        contract.filters.Transfer(),
                        0,  // Start from block 0 (the genesis block)
                        currentBlock
                    );

                    // Use a Set to store unique token holder addresses
                    const holders = new Set<string>();

                    // Iterate over all Transfer events
                    filterTokenHolder.forEach((event: any) => {
                        const { from, to } = event.args!;

                        // Exclude the zero address as it represents burning or minting tokens
                        if (from !== ethers.ZeroAddress) {
                            holders.add(from);  // Add sender to the holders set
                        }
                        if (to !== ethers.ZeroAddress) {
                            holders.add(to);  // Add receiver to the holders set
                        }
                    });

                    // Filter holders who still have a positive balance
                    const realHolders = new Set<string>();

                    for (const address of Array.from(holders)) {
                        const balance = await tokenBalance(contractAddress, address);
                        if (balance > BigInt(0)) {
                            realHolders.add(address);
                        }
                    }

                    setHolders(holders.size)

                    // Set to USD price
                    const priceInUSD = await fetchTokenPriceInUSD('ethereum');

                    if (priceInUSD === null) {
                        console.error('Failed to convert values to USD due to missing price.');
                        return null;
                    }

                    const marketCapInUSD = String(marketCap * priceInUSD);
                    const volumeInUSD = String(volumeETH * priceInUSD);
                    setMarketcapUSD(marketCapInUSD);
                    setVolumeUSD(volumeInUSD)

                    // Fet All-time volume
                    const startBlock = 0;
                    const transferEvents2 = await contract.queryFilter(contract.filters.Transfer(null, null), startBlock, currentBlock);
                    const totalVolumeWei = transferEvents2.reduce((total: any, event: any) => total + Number(ethers.formatUnits(event.args?.value, 18)), 0);
                    const totalVolumeETH = totalVolumeWei * Number(ethers.formatEther(price));

                    // Set the total volume
                    const volumeInUSDAllTimes = String(totalVolumeETH * priceInUSD);
                    setVolumeUSDAllTime(volumeInUSDAllTimes);

                }

            } catch (error) {
                console.error('Failed to fetch contract data:', error);
            }
        };

        fetchContractData();
    }, [contractAddress]);

    useEffect(() => {
        if (launchDiscover) {
            fetchAirdropPosts("Finance")
                .then(setAirdropPosts)
                .catch((err) => console.error('Failed to fetch airdrop posts:', err.message));
        }
    }, [launchDiscover]);

    return (
        <div className="bg-gradient-to-b from-white via-gray-300 to-gray-50">
            {launchDiscover ? (
                <div className="flex flex-col lg:flex-row p-6">
                    <div className="flex-1">
                        <h2 className="text-xl text-lime-600 font-bold my-4">Discover the {tokenName} &#40;{tokenSymbol}&#41;</h2>
                        <p className="mb-4">
                            In the vast universe of decentralized finance, a star shines brightly—{tokenName}. Born from the Ethereum blockchain, this ERC-20 token has not only captivated investors but also carved a niche in the ever-evolving landscape of Automated Market Makers &#40;AMMs&#41;.
                        </p>

                        <h3 className="text-lg text-lime-600 font-semibold mb-3">The Journey of {tokenName} &#40;{tokenSymbol}&#41;</h3>
                        <p className="mb-4">
                            {tokenName} isn't just another digital asset, it's a beacon of innovation. With its built-in AMM, {tokenName} seamlessly facilitates the determination of prices between itself and ETH, ensuring fair and transparent trading for all participants.
                        </p>
                        <p className="mb-4">As of now, each {tokenName} is valued at {currentPrice} ETH. This price, ever-fluid, reflects the dynamic nature of the market, influenced by the forces of supply, demand, and trading volume.</p>

                        <p className="mb-4">The Marketcap or total value of all {tokenName} combined has reached a staggering {marketCap} ETH. This figure isn't just a number, it represents the collective trust and belief that investors have placed in {tokenName}.</p>

                        <p className="mb-4">Over the last 24 hours, {volume} ETH worth of {tokenName} has exchanged hands. This volume showcases the token's liquidity and the vibrancy of its trading community.</p>

                        <h3 className="text-lg text-lime-600 font-semibold mb-3">A Glimpse at the Supply</h3>
                        <p className="mb-4">
                            {tokenName}'s total supply is a key pillar of its value proposition. With a finite number of tokens available, scarcity plays a significant role in driving its price.
                        </p>
                        <p className="mb-4">There are {totalSupply} {tokenSymbol} tokens in existence. Each token represents a fraction of the {tokenName} ecosystem, contributing to its market presence.</p>

                        <h3 className="text-lg text-lime-600 font-semibold mb-3">The Community Behind {tokenName} &#40;{tokenSymbol}&#41;</h3>
                        <p className="mb-4">Over {holders} unique addresses hold {tokenName} &#40;{tokenSymbol}&#41;, each contributing to the token's decentralized ownership. This diverse community is the lifeblood of {tokenName}, driving its adoption and use across various platforms.</p>

                        <h3 className="text-lg text-lime-600 font-semibold mb-3">The Lifeblood: Reserves</h3>
                        <p className="mb-4">The contract holds {ethReserve} ETH in reserve, a safety net ensuring liquidity and trust in the system. Alongside ETH, the contract also holds {tokenReserve} {tokenSymbol} in reserve, bolstering the token's ability to meet market demands.</p>

                        <h3 className="text-lg text-lime-600 font-semibold mb-3">Conclusion</h3>
                        <p className="mb-4">
                            {tokenName} is more than just a digital asset, it's a story of innovation, community, and trust. As it continues to evolve, {tokenName} promises to remain a cornerstone of the decentralized finance ecosystem, guiding its holders on a journey of growth and discovery.
                        </p>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 lg:ml-8 mt-10 lg:mt-6">
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div className="bg-gray-100 w-full p-4 rounded-3xl">
                                <h3 className="text-sm">Market Cap (USD)</h3>
                                <p className="text-3xl text-gray-700 font-semibold">{formatToUSD(Number(marketcapUSD))}</p>
                            </div>
                            <div className="bg-gray-100 w-full p-4 rounded-3xl">
                                <h3 className="text-sm">Volume (USD) <span className="text-sm">&#40;24 Hours&#41;</span></h3>
                                <p className="text-3xl text-gray-700 font-semibold">{formatToUSD(Number(volumeUSD))}</p>
                            </div>
                            <div className="bg-gray-100 w-full p-4 rounded-3xl">
                                <h3 className="text-sm">Volume (USD) <span className="text-sm">&#40;All Time&#41;</span></h3>
                                <p className="text-3xl text-gray-700 font-semibold">{formatToUSD(Number(volumeUSDAllTime))}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {airdropPosts.slice(0, 4).map((post: any) => (
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
            ) : ('')}
        </div>
    )
}

export default TokenAbout;