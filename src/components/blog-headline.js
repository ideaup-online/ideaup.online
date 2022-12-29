import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import IdeaUpElectronicsIcon from '../components/icons/idea-up-electronics-icon';
import IdeaUpAstronomyIcon from '../components/icons/idea-up-astronomy-icon';
import IdeaUpPhotographyIcon from '../components/icons/idea-up-photography-icon';
import SmartQuote from '../components/smart-quote';
import { format } from 'date-fns';

const StyledElectronicsIcon = styled(IdeaUpElectronicsIcon)`
  width: 2.5em;
  height: 2.5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const StyledAstronomyIcon = styled(IdeaUpAstronomyIcon)`
  width: 2.5em;
  height: 2.5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const StyledPhotographyIcon = styled(IdeaUpPhotographyIcon)`
  width: 2.5em;
  height: 2.5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const PostDetails = styled.div`
  grid-area: details;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  font-family: 'Dosis', sans-serif;
`;

const PostDateTTRWrapper = styled.div`
  order: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  padding-top: 0.2em;
`;

const PostDate = styled.div`
  order: 1;
  font-size: 0.9em;
  padding-right: 0.2em;
  span {
    color: var(--text-color-dim);
  }
`;

const PostTTR = styled.div`
  order: 2;
  text-align: right;
  font-size: 0.9em;
  span {
    color: var(--text-color-dim);
  }
`;

const PostTitle = styled.div`
  grid-area: title;
  color: var(--base-color);
  font-family: 'Dosis', sans-serif;
  font-size: 1.6em;
  font-weight: 500;
  line-height: 1.1;
`;

const PostDescription = styled.div`
  order: 1;
  color: var(--text-color);
  font-family: 'Solway', sans-serif;
  font-weight: 300;
  padding-top: 0.2em;
`;

const PostWrapper = styled.div`
  display: grid;
  justify-content: stretch;
  align-content: stretch;
  justify-items: stretch;
  align-items: center;
  grid-template-columns: min-content auto;
  grid-template-rows: min-content auto;
  grid-template-areas:
    'icon title'
    '. details';
  padding-top: 0.6em;
  padding-bottom: 0.6em;
`;

const PostIcon = styled.div`
  grid-area: icon;
  padding-right: 0.5em;
  padding-top: 0.2em;
`;

function Icon(props) {
  if ('electronics' === props.category) {
    return <StyledElectronicsIcon />;
  } else if ('astronomy' === props.category) {
    return <StyledAstronomyIcon />;
  } else if ('photography' === props.category) {
    return <StyledPhotographyIcon />;
  }
}

const BlogHeadline = ({ postData, className }) => (
  <PostWrapper className={className}>
    <PostIcon>
      <Icon category={postData.category} />
    </PostIcon>
    <PostTitle>
      <Link href={`blog/${postData.category}/${postData.id}`}>
        <SmartQuote>{postData.title}</SmartQuote>
      </Link>
    </PostTitle>
    <PostDetails>
      <PostDescription>
        <SmartQuote>{postData.description}</SmartQuote>
      </PostDescription>
      <PostDateTTRWrapper>
        <PostDate>
          <span role="img" aria-label="date posted">
            📆{' '}
          </span>
          <span>{format(new Date(postData.date), 'MMMM dd, yyyy')}</span> in{' '}
          <span>{postData.category}</span>
        </PostDate>
        <PostTTR>
          <span role="img" aria-label="time to read">
            ⏱{' '}
          </span>
          <span>{Math.ceil(postData.readingMinutes)}</span> min ≈&nbsp;
          <span>{postData.readingWords}</span> words
          {/* <span>??</span> min ≈&nbsp;
          <span>??</span> words */}
        </PostTTR>
      </PostDateTTRWrapper>
    </PostDetails>
  </PostWrapper>
);

export default BlogHeadline;
