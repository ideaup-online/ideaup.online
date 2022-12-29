export type BlogHeadlineData = {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  readingMinutes: number;
  readingWords: number;
};

export type BlogIdData = {
  id: string;
  category: string;
};

export type BlogPostData = {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  content: string;
};
