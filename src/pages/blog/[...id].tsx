import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout';
import { getAllBlogIdData, getBlogPostData } from 'lib/blog';
import { BlogPostData } from 'lib/blog-types';
import styled from 'styled-components';
import IdeaUpElectronicsIcon from '@/components/icons/idea-up-electronics-icon';
import IdeaUpAstronomyIcon from '@/components/icons/idea-up-astronomy-icon';
import IdeaUpPhotographyIcon from '@/components/icons/idea-up-photography-icon';
import PageTOC from '@/components/page-toc';
import smartquotes from 'smartquotes-ts';

const StyledElectronicsIcon = styled(IdeaUpElectronicsIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: coral;
  }
  .icon-border {
    stroke: coral;
  }
`;

const StyledAstronomyIcon = styled(IdeaUpAstronomyIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: coral;
  }
  .icon-border {
    stroke: coral;
  }
`;

const StyledPhotographyIcon = styled(IdeaUpPhotographyIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: coral;
  }
  .icon-border {
    stroke: coral;
  }
`;

const PostContent = styled.section`
  order: 2;
  color: rgb(160, 160, 160);
  max-width: 40em;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 3fr;
  grid-column-gap: 1em;
  align-items: start;
  @media (max-width: 40em), (max-height: 50em) {
    grid-template-columns: minmax(0, 1fr);
    #nav-wrapper {
      display: none;
    }
  }
`;

const NavWrapper = styled.div`
  grid-column: 1 / span 1;
  position: -webkit-sticky;
  position: sticky;
  top: 1.5em;
  padding-top: 1em;
  margin-block-start: 0.4em;
  margin-block-end: 0.4em;
  font-family: 'Solway', serif;
  color: rgb(160, 160, 160);
  display: flex;
  flex-direction: column;
`;

const MDXWrapper = styled.div`
  grid-column: 2 / span 1;
  min-width: 0;
  margin: 0 0;
  div.code-toolbar > .toolbar {
    position: absolute;
    top: 0.3em;
    right: 1em;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }
  code {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    color: #ccc;
    background-color: #98562d;
    font-size: 0.75em;
    padding: 0.2em;
    border-radius: 0.3em;
    white-space: normal;
  }
  pre {
    code {
      padding: 0;
    }
    margin: 0.5em;
    border-radius: 0.5em;
    padding: 0.3em;
    overflow: auto;
    max-height: 50em;
  }
  .anchor {
    stroke: rgb(80, 80, 80);
  }
  .embedVideo-container {
    width: 90vw;
  }
  iframe {
    border-radius: 0.5em;
    max-height: 100vh;
  }
  a {
    color: #00abff;
  }
  h3 {
    color: coral;
    font-size: 1.25em;
    font-family: 'Dosis', sans-serif;
    font-weight: 400;
  }
  h4 {
    color: rgb(192, 192, 192);
  }
  p {
    font-family: 'Solway', serif;
    line-height: 1.4;
  }
  blockquote {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }
  img,
  svg {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0.5em;
    height: initial;
  }
  .modal-image-wrapper {
    cursor: pointer;
  }
  .anchor svg {
    fill: rgb(160, 160, 160);
    width: 25;
  }
  .anchor {
    margin-left: -16px;
  }
`;

const PostHeader = styled.header`
  order: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1em;
  padding-bottom: 1em;
`;

const PostDate = styled.div`
  order: 2;
  font-size: 0.9em;
`;

const PostTitle = styled.div`
  order: 1;
  color: coral;
  font-family: 'Dosis', sans-serif;
  font-size: 1.9em;
  font-weight: 500;
  line-height: 1.1;
`;

const IconWrapper = styled.div`
  order: 1;
  padding-right: 1em;
`;

const Headline = styled.div`
  order: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NavContainer = styled.ul`
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  border-top: solid;
  border-width: 1px;
  padding-top: 0.75em;
  display: none;
  @media (max-width: 40em), (max-height: 50em) {
    display: flex;
  }
`;

const NavPrevious = styled.li`
  order: 1;
`;

const NavNext = styled.li`
  order: 2;
`;

const Modal = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */

  .modal-content {
    margin: auto;
    display: block;
    border-radius: 0.5em;
    max-width: 70%;
    max-height: 80%;
    width: auto;
    height: auto;
    object-fit: scale-down;
    background: #222;
  }
  #modal-caption {
    margin: auto;
    display: block;
    width: 80%;
    text-align: center;
    color: coral;
    padding: 10px 0;
    height: 150px;
  }
  .modal-close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: rgb(160, 160, 160);
    font-size: 40px;
    font-weight: bold;
    transition: 0.3s;
  }
  .modal-close:hover,
  .modal-close:focus {
    color: coral;
    text-decoration: none;
    cursor: pointer;
  }
`;

function Icon({ category }: { category: string }): JSX.Element {
  if ('electronics' === category) {
    return <StyledElectronicsIcon />;
  } else if ('astronomy' === category) {
    return <StyledAstronomyIcon />;
  } else if ('photography' === category) {
    return <StyledPhotographyIcon />;
  } else {
    return <div>{category}</div>;
  }
}

function modalClose() {
  const modal = document.getElementById('image-modal');

  if (modal) {
    modal.style.display = 'none';
  }
}

function modalClick(e: Event) {
  const modalImg = document.getElementById('image-modal-content');

  if (e.target !== modalImg) {
    modalClose();
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    modalClose();
  }
}

function showModalImage(e: MouseEvent) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('image-modal-content');
  const caption = document.getElementById('modal-caption');

  if (modal) {
    modal.style.display = 'block';
  }

  if (modalImg) {
    const modalTmp = modalImg as HTMLImageElement;
    const targetTmp = e.target as HTMLImageElement;
    modalTmp.loading = targetTmp.loading;
    modalTmp.srcset = targetTmp.srcset;
    modalTmp.src = targetTmp.src;
    modalTmp.alt = targetTmp.alt;
  }

  if (caption) {
    caption.innerText = (e.target as HTMLImageElement).alt;
  }
}

export async function getStaticPaths() {
  const allIdData = getAllBlogIdData();

  const paths = allIdData.map((idData) => {
    return {
      params: {
        id: [idData.category, idData.id],
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string[] } }) {
  const blogPostData = getBlogPostData(params.id[1]);
  return {
    props: {
      blogPostData,
    },
  };
}

export default function BlogPost({
  blogPostData,
}: {
  blogPostData: BlogPostData;
}): JSX.Element {
  useEffect(() => {
    const modal = document.getElementById('image-modal');
    if (modal) {
      modal.onclick = modalClick;
    }

    const closeSpan = document.getElementById('modal-close');
    if (closeSpan) {
      closeSpan.onclick = function () {
        modalClose();
      };
    }

    const elems = document.getElementsByClassName('modal-image-wrapper');
    for (let i = 0; i < elems.length; i++) {
      (elems[i] as HTMLElement).onclick = showModalImage;
    }

    document.addEventListener('keydown', onKeyDown, false);

    // See if there is another way to do this
    // const linkTag = document.createElement('link');
    // linkTag.rel = 'stylesheet';
    // linkTag.href = '/prism.css';
    // document.getElementsByTagName('head')[0].appendChild(linkTag);
    // const scriptTag = document.createElement('script');
    // scriptTag.src = '/prism.js';
    // document.getElementsByTagName('head')[0].appendChild(scriptTag);

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    };
  }, []);

  return (
    <Layout
      title={blogPostData.title}
      showStyle="compact"
      content={
        <div>
          <Modal id="image-modal">
            <span className="modal-close" id="modal-close">
              &times;
            </span>
            <img className="modal-content" id="image-modal-content" alt="" />
            <div id="modal-caption"></div>
          </Modal>
          <StyledArticle>
            <PostHeader id="post-header">
              <IconWrapper>
                <Icon category={blogPostData.category} />
              </IconWrapper>
              <Headline>
                <PostTitle>{String(smartquotes(blogPostData.title))}</PostTitle>
                <PostDate>{blogPostData.date}</PostDate>
              </Headline>
            </PostHeader>
            <PostContent>
              <NavWrapper id="nav-wrapper">
                <PageTOC
                  up={{ target: '/', text: 'Back to List' }}
                  previous={
                    null
                    // previous && {
                    //   target: previous.fields.slug,
                    //   text: previous.frontmatter.title,
                    // }
                  }
                  next={
                    null
                    // next && {
                    //   target: next.fields.slug,
                    //   text: next.frontmatter.title,
                    // }
                  }
                />
              </NavWrapper>
              <MDXWrapper id="post-content">{blogPostData.content}</MDXWrapper>
            </PostContent>
          </StyledArticle>
          <nav>
            <NavContainer>
              <NavPrevious>
                {
                  null
                  // previous && (
                  //   <Link href={previous.fields.slug} rel="prev">
                  //     ← {String(smartquotes(previous.frontmatter.title))}
                  //   </Link>
                  // )
                }
              </NavPrevious>
              <NavNext>
                {
                  null
                  // next && (
                  //   <Link href={next.fields.slug} rel="next">
                  //     {String(smartquotes(next.frontmatter.title))} →
                  //   </Link>
                  // )
                }
              </NavNext>
            </NavContainer>
          </nav>
        </div>
      }
    />
  );
}
