import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { tokenId: string } }): Promise<Metadata> {
    const tokenId = params.tokenId;

    try {
        // Fetch data from your API
        const response = await fetch(`https://www.ticker.id/api/token/${tokenId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch token data');
        }
        const data = await response.json();

        const title = `The ticker is $${data.tSymbol} | ${data.tPrice} ETH`;
        const description = `The Marketcap or total value of all ${data.tName} combined has reached a staggering ${data.marketCap} ETH.`;
        const imageUrl = `https://www.ticker.id/api/og/${tokenId}`;

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
                        alt: `${data.tSymbol} logo`,
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