import fs, { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogHeadlineData } from './blog-types';
import readingTime from 'reading-time';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export function getSortedBlogHeadlineData(): BlogHeadlineData[] {
  // Get directories under /content/blog
  const blogPostDirs = fs
    .readdirSync(blogDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const blogHeadlineData: BlogHeadlineData[] = [];
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
      blogHeadlineData.push({
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

  // Sort post headlines by date
  return blogHeadlineData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}
