import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { postId: string } }): Promise<Metadata> {
    const postId = params.postId;

    try {
        // Fetch data from your API
        const response = await fetch(`https://ticker.id/api/blog/${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }
        const data = await response.json();

        const title = `${data.title} | Ticker Blog`;
        const description = `${data.description}`;
        const imageUrl = `https://www.ticker.id/${data.image}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: `https://www.ticker.id/blog/${postId}`,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 600,
                        alt: `${data.title}`,
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
            title: 'Ticker Blog | Turn Tokens into Triumph',
            description: 'Failed to load post data',
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