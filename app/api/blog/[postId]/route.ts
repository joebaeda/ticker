import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content');

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const fullPath = path.join(postsDirectory, `${postId}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const processedContent = await remark()
    .use(gfm) // Add this line to support GitHub Flavored Markdown, including tables
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return NextResponse.json({
    postId,
    contentHtml,
    ...matterResult.data,
  });
}
