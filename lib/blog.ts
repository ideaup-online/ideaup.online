import fs, { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData } from './blog-types';
import readingTime from 'reading-time';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export function getSortedPostsData(): PostData[] {
  // Get directories under /content/blog
  const blogPostDirs = fs
    .readdirSync(blogDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const allPostsData: PostData[] = [];
  blogPostDirs.forEach((blogPostDir) => {
    // Read markdown file as string
    let fullPath = path.join(blogDirectory, blogPostDir, 'index.md');
    if (!existsSync(fullPath)) {
      fullPath = path.join(blogDirectory, blogPostDir, 'index.mdx');
    }
    if (existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Estimate the reading time and word count
      const readingTimeResult = readingTime(matterResult.content);

      // Combine the data with the id
      allPostsData.push({
        id: blogPostDir,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category: matterResult.data.category,
        description: matterResult.data.description,
        readingMinutes: readingTimeResult.minutes,
        readingWords: readingTimeResult.words,
      });
    }
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}
