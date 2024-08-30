import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { tokenId: string } }): Promise<Metadata> {
    const tokenId = params.tokenId;

    try {
        // Fetch data from your API
        const response = await fetch(`/api/token/${tokenId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch token data');
        }
        const data = await response.json();

        const title = `The ticker is $${data.symbol} | ${data.price} ETH`;
        const description = `Discover ${data.symbol}, a unique cryptocurrency. Stay updated with the current price and explore the recent transactions on the blockchain. Invest wisely and stay ahead with ${data.symbol}.`;
        const imageUrl = 'https://www.ticker.id/og-image.jpg';

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: `https://www.ticker.id/token/${tokenId}`,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 600,
                        alt: `${data.symbol} logo`,
                    },
                ],
                siteName: 'ticker',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Token | Price',
            description: 'Failed to load token data',
        };
    }
}

export default function TokenDetailLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>{children}</div>
    );
}