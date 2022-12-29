import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout';
import BlogHeadline from '@/components/blog-headline';
import { getAllSortedBlogHeadlineData } from 'lib/blog';
import { BlogHeadlineData } from 'lib/blog-types';

const StyledContent = styled.div`
  max-width: 76ch;
`;

export async function getStaticProps(): Promise<{
  props: { allHeadlineData: BlogHeadlineData[] };
}> {
  const allHeadlineData = getAllSortedBlogHeadlineData();
  return {
    props: {
      allHeadlineData,
    },
  };
}

export default function Home({
  allHeadlineData,
}: {
  allHeadlineData: BlogHeadlineData[];
}) {
  return (
    <Layout
      title="Home"
      content={
        <StyledContent>
          {allHeadlineData.map((headlineData) => (
            <BlogHeadline headlineData={headlineData} key={headlineData.id} />
          ))}
        </StyledContent>
      }
    />
  );
}
