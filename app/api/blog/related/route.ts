import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content');

export async function POST(request: Request) {
    const { tags } = await request.json();

    if (!tags || tags.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data,
        };
    });

    const relatedPosts = allPostsData.filter((post: any) =>
        post.tags?.some((tag: string) => tags.includes(tag))
    );

    return NextResponse.json(relatedPosts);
}
