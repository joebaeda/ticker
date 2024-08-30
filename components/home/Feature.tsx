import Image from "next/image";

export default function Feature() {
    return (
        <div className="pt-10 px-6 flex flex-col md:flex-row items-center bg-gradient-to-b from-white via-gray-300 to-gray-50">
            {/* Text Section */}
            <div className="md:w-1/2 mb-6 md:mb-0">
                <blockquote className="p-4 text-2xl font-extralight text-gray-700">&#34;We want to keep everything as smooth and honest as grandma&#39;s cookies&#46; No price manipulation&#44; no pull-pull&#44; just pure and fair trading&#46; The tokens you&#39;ll create are meant to last&#44; not to disappear like a magician&#39;s bunny&#46;&#34;</blockquote>
            </div>

            {/* Image Section */}
            <div className="mx-auto">
                <Image
                    src="/simple-icon.svg"
                    alt="Ticker"
                    width={350}
                    height={350}
                    className="rounded-lg"
                    loading="eager"
                    priority={true}
                />
            </div>
        </div>
    );
};
