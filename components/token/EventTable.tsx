import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
    tickerContract, 
    tickerContractProvider, 
    tokenPriceInETH, 
    tokenSymbols 
} from '@/lib/token';

interface EventTableProps {
    tokenAddress: string;
}

const EventTable: React.FC<EventTableProps> = ({ tokenAddress }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const provider = tickerContractProvider();
                const contract = tickerContract(tokenAddress);

                // Get the block number for the timestamp
                const currentBlock = await provider.getBlockNumber();
                const price = await tokenPriceInETH(tokenAddress);
                const tSymbol = await tokenSymbols(tokenAddress);
                setTokenSymbol(tSymbol);

                // Fetch Transfer events
                const transferEvents = await contract.queryFilter(contract.filters.Transfer(), 0 - currentBlock);
                const parsedTransfers = await Promise.all(transferEvents.map(async (event: any) => {
                    const block = await provider.getBlock(event.blockNumber);
                    if (!block) return null; // Handle null block case
                    const tx = await provider.getTransaction(event.transactionHash);
                    if (!tx) return null; // Handle null tx case
                    const decodedData = contract.interface.parseTransaction({ data: tx.data });
                    return {
                        etherscanTx: 'https://sepolia.etherscan.io/tx/' + event.transactionHash,
                        etherscanFrom: 'https://sepolia.etherscan.io/address/' + String(event.args.from).toLowerCase(),
                        etherscanTo: 'https://sepolia.etherscan.io/address/' + String(event.args.to).toLowerCase(),
                        eventname: decodedData?.name === "swapEthForTokens" ? "Buy" : decodedData?.name === "swapTokensForEth" ? "Sell" : "Transfer",
                        from: event.args.from.slice(0, 8), // Slice the from address
                        to: event.args.to.slice(0, 8), // Slice the to address
                        tokenValue: parseFloat(ethers.formatEther(event.args.value)).toFixed(0), // Format value to Ether
                        ethValue: parseFloat(String(Number(ethers.formatEther(event.args.value)) * Number(ethers.formatEther(price)))).toFixed(6),
                        timestamp: formatDistanceToNow(new Date(block.timestamp * 1000), { addSuffix: true }),
                    };
                }));

                // Filter out null events
                const validEvents = parsedTransfers.filter(event => event !== null);

                // Set events sorted by newest first
                setEvents(validEvents.reverse()); // Reverse to have the newest events first
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
        const intervalId = setInterval(fetchEvents, 60000); // Refresh every 60 seconds

        return () => clearInterval(intervalId);
    }, [tokenAddress]);

    // Get current page events
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(events.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="mx-4 lg:m-6">
            <div className="rounded-t-3xl flex flex-col overflow-x-auto text-gray-700">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full sm:px-6 lg:px-8 bg-gray-50">
                        <div className="overflow-auto">
                            <table className="min-w-full text-left text-surface">
                                <thead className="border-b border-neutral-200 bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Method</th>
                                        <th scope="col" className="px-6 py-4">Amount</th>
                                        <th scope="col" className="px-6 py-4">Amount</th>
                                        <th scope="col" className="px-6 py-4">From</th>
                                        <th scope="col" className="px-6 py-4">To</th>
                                        <th scope="col" className="px-6 py-4 text-right">Age</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEvents.length > 0 ? (
                                        currentEvents.map((event: any, index: number) => (
                                            <tr className="border-b border-neutral-200" key={index}>
                                                <td className="whitespace-nowrap px-6 py-4"><a href={event.etherscanTx} target="_blank" className="hover:text-blue-500">{event.eventname}</a></td>
                                                <td className="whitespace-nowrap px-6 py-4">{event.tokenValue} <span className="text-lime-600 font-semibold">{tokenSymbol}</span></td>
                                                <td className="whitespace-nowrap px-6 py-4">{event.ethValue} <span className="text-lime-600 font-semibold">ETH</span></td>
                                                <td className="whitespace-nowrap px-6 py-4"><a href={event.etherscanFrom} target="_blank" className="hover:text-blue-500">{event.from}</a></td>
                                                <td className="whitespace-nowrap px-6 py-4"><a href={event.etherscanTo} target="_blank" className="hover:text-blue-500">{event.to}</a></td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">{event.timestamp}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center px-6 py-4">
                                                No events found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {events.length > itemsPerPage && (
                <div className="flex justify-between items-center p-2 bg-gray-100">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default EventTable;
