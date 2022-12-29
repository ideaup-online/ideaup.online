import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import BlogHeadline from '../components/blog-headline';
import { getSortedPostsData } from '../../lib/blog';
import { PostData } from '../../lib/blog-types';

const StyledContent = styled.div`
  max-width: 76ch;
`;

export async function getStaticProps(): Promise<{
  props: { allPostsData: PostData[] };
}> {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }: { allPostsData: PostData[] }) {
  return (
    <Layout
      title="Home"
      content={
        <StyledContent>
          {allPostsData.map((postData) => (
            <BlogHeadline postData={postData} key={postData.id} />
          ))}
        </StyledContent>
      }
    />
  );
}
