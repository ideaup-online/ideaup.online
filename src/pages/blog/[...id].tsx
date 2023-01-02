import { useEffect } from 'react';
import Layout from '@/components/layout';
import { getAllBlogIdData, getBlogPostData } from 'lib/blog';
import { BlogPostData } from 'lib/blog-types';
import styled from '@emotion/styled';
import IdeaUpElectronicsIcon from '@/components/icons/idea-up-electronics-icon';
import IdeaUpAstronomyIcon from '@/components/icons/idea-up-astronomy-icon';
import IdeaUpPhotographyIcon from '@/components/icons/idea-up-photography-icon';
import PageTOC from '@/components/page-toc';
import smartquotes from 'smartquotes-ts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { format } from 'date-fns';
import remarkSmartypants from '@silvenon/remark-smartypants';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import path from 'path';
import NoTrailCalculator from '@/components/no-trail-calculator';
import TestPhotoFlipper from '@/components/blog/trouble-with-500-rule/test-photo-flipper';

const StyledElectronicsIcon = styled(IdeaUpElectronicsIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const StyledAstronomyIcon = styled(IdeaUpAstronomyIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const StyledPhotographyIcon = styled(IdeaUpPhotographyIcon)`
  width: 5em;
  height: 5em;
  .icon-label {
    stroke: var(--accent-color);
  }
  .icon-border {
    stroke: var(--base-color);
  }
`;

const PostContent = styled.section`
  order: 2;
  color: var(--text-color);
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
    color: var(--base-color);
    font-size: 1.25em;
    font-family: 'Dosis', sans-serif;
    font-weight: 400;
  }
  h4 {
    color: var(--accent-color);
    font-weight: 400;
  }
  p {
    font-family: 'Solway', serif;
    line-height: 1.4;
    margin: 1em 0;
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
    stroke: var(--heading-link-icon-color);
    width: 25;
  }
  .anchor {
    margin-left: -20px;
    margin-right: 4px;
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
  color: var(--base-color);
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

  const mdxSource = await serialize(blogPostData.content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkSmartypants],
      rehypePlugins: [
        rehypeSlug,
        // [rehypePrism, { plugins: ['line-numbers'] }],
        [
          rehypeAutolinkHeadings,
          {
            content: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  ariaHidden: 'true',
                  focusable: 'false',
                  height: '16',
                  version: '1.1',
                  viewBox: '0 0 16 16',
                  width: '16',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      fillRule: 'evenodd',
                      d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z',
                    },
                  },
                ],
              },
            ],
            properties: { className: 'anchor', ariaHidden: true, tabIndex: -1 },
          },
        ],
      ],
      development: false,
    },
    scope: {
      title: blogPostData.title,
      date: blogPostData.date,
      category: blogPostData.category,
      description: blogPostData.description,
    },
  });

  return {
    props: {
      blogPostData,
      source: mdxSource,
    },
  };
}

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
// import NoTrailCalculator from '../../../src/components/no-trail-calculator.js';
// import TestPhotoFlipper from '../../../src/components/blog/trouble-with-500-rule/test-photo-flipper.js';

export default function BlogPost({
  blogPostData,
  source,
}: {
  blogPostData: BlogPostData;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
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
    const linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = '/prism.css';
    document.getElementsByTagName('head')[0].appendChild(linkTag);
    const scriptTag = document.createElement('script');
    scriptTag.src = '/prism.js';
    document.getElementsByTagName('head')[0].appendChild(scriptTag);

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    };
  }, []);

  const components = {
    img: (props: any) => {
      const newProps = { ...props };
      newProps.src = `/images/blog/${blogPostData.id}/${props.src}`;
      return <img {...newProps}></img>;
    },
    code: (props: any) => {
      if (!props.className) {
        return <code {...props}>{props.children}</code>;
      } else {
        const myProps = JSON.parse(JSON.stringify(props));
        let match = null;
        let dataLine = null;
        let dataSrc = null;
        do {
          match = myProps.className.match(/\{[^[{}]*\}/);
          if (match === null) {
            break;
          }
          const matchLen = match[0].length;
          const baseMatch = match[0].substr(1, matchLen - 2);
          if (baseMatch === 'line-numbers' || baseMatch === 'no-line-numbers') {
            myProps.className = myProps.className
              .substring(0, match.index)
              .concat(
                ' ',
                baseMatch,
                ' ',
                myProps.className.substring(match.index + matchLen),
              );
          } else {
            const fileTarget = 'file-';
            myProps.className = myProps.className
              .substring(0, match.index)
              .concat(myProps.className.substring(match.index + matchLen));
            if (baseMatch.startsWith(fileTarget)) {
              dataSrc = baseMatch.substring(fileTarget.length);
            } else {
              dataLine = baseMatch;
            }
          }
        } while (true);
        if (dataSrc !== null) {
          const browserPath = `/blog-data/${blogPostData.id}/${dataSrc}`;
          if (typeof window === `undefined`) {
            // not in a browser, copy the file
            const pathsNew = [process.cwd(), 'public', browserPath];
            const pathsSource = [
              process.cwd(),
              `content/blog/${blogPostData.id}`,
              dataSrc,
            ];
            const newFilePath = path.posix.join(...pathsNew);
            const sourceFilePath = path.posix.join(...pathsSource);
            const fs = require('fs-extra');
            try {
              fs.ensureDir(path.dirname(newFilePath));
              fs.copy(sourceFilePath, newFilePath);
            } catch (err) {
              console.error(`error copying file`, err);
            }
          }
          return (
            <pre
              data-line={dataLine}
              data-src={browserPath}
              data-download-link="true"
              className={myProps.className}
            ></pre>
          );
        } else {
          return (
            <pre data-line={dataLine} className={myProps.className}>
              <code {...myProps} />
            </pre>
          );
        }
      }
    },
    pre: (props: any) => {
      return props.children;
    },
    // NoTrailCalculator: dynamic(
    //   () => import('../../components/no-trail-calculator'),
    // ),
    // TestPhotoFlipper: dynamic(
    //   () =>
    //     import(
    //       '../../components/blog/trouble-with-500-rule/test-photo-flipper'
    //     ),
    // ),
    NoTrailCalculator: NoTrailCalculator,
    TestPhotoFlipper: TestPhotoFlipper,
  };

  return (
    // <>
    //   <Script src="/prism.js" />
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
                <PostDate>
                  {format(new Date(blogPostData.date), 'MMMM dd, yyyy')}
                </PostDate>
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
              <MDXWrapper id="post-content">
                <MDXRemote {...source} components={components} />
              </MDXWrapper>
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
    // </>
  );
}
