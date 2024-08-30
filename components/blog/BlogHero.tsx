import { useEffect, useState } from "react";

interface BlogHeroProps {
    onSearch: any;
    heroText: string;
    postFound: boolean;
}

const BlogHero = ({ onSearch, heroText, postFound }: BlogHeroProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchQuery); // Trigger search after debounce period
        }, 300); // Adjust debounce delay as needed

        return () => {
            clearTimeout(handler); // Clear the timeout if input changes again
        };
    }, [searchQuery, onSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-40 max-w-full flex flex-col gap-4 text-gray-100 md:flex-row items-center p-6">
            <div className="max-w-3xl text-left">
                <p className="text-xl py-4">
                    {heroText}
                </p>
            </div>
            <div className="w-full text-gray-500">
                <form className="relative">
                    <input
                        type="text"
                        placeholder="Enter keyword here"
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="w-full p-3 placeholder:opacity-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-blue-500 border border-transparent rounded-r-lg hover:bg-blue-600"
                        onClick={(e) => e.preventDefault()} // Prevent form submission
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="#F2F2F2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 4a7 7 0 014.781 11.344l5.115 5.115a1 1 0 01-1.415 1.415l-5.115-5.115A7 7 0 1111 4z"
                            />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BlogHero;
