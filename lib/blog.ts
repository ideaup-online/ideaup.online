import fs, { existsSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogHeadlineData, BlogIdData, BlogPostData } from './blog-types';
import readingTime from 'reading-time';

const blogDirectory = path.join(process.cwd(), 'content/blog');

function iterateBlogPosts(
  callback: (id: string, matterResult: matter.GrayMatterFile<string>) => void,
): void {
  // Get directories under /content/blog
  const blogPostDirs = fs
    .readdirSync(blogDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
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

      // Call callback
      callback(blogPostDir, matterResult);
    }
  });
}

export function getAllSortedBlogHeadlineData(): BlogHeadlineData[] {
  const allHeadlineData: BlogHeadlineData[] = [];
  iterateBlogPosts((id, matterResult) => {
    // Estimate the reading time and word count
    const readingTimeResult = readingTime(matterResult.content);

    // Combine the data with the id
    allHeadlineData.push({
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
      description: matterResult.data.description,
      readingMinutes: readingTimeResult.minutes,
      readingWords: readingTimeResult.words,
    });
  });

  // Sort post headlines by date
  return allHeadlineData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllBlogIdData(): BlogIdData[] {
  const allBlogIdData: BlogIdData[] = [];
  iterateBlogPosts((id, matterResult) => {
    allBlogIdData.push({
      id,
      category: matterResult.data.category,
    });
  });

  return allBlogIdData;
}

export function getBlogPostData(id: string): BlogPostData {
  // Check for MD file first
  let fullPath = path.join(blogDirectory, id, 'index.md');

  // If not there, try MDX
  if (!existsSync(fullPath)) {
    fullPath = path.join(blogDirectory, id, 'index.mdx');
  }

  // Only read if it exists now
  if (existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
      description: matterResult.data.description,
      content: matterResult.content,
    };
  } else {
    return {
      id: '??',
      title: '??',
      date: '??',
      category: '??',
      description: '??',
      content: '??',
    };
  }
}
