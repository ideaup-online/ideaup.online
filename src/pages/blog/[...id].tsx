/* eslint-disable @next/next/no-img-element */
import { useEffect } from 'react';
import Layout from '@/components/layout';
import {
  getAllBlogIdData,
  getAllSortedBlogHeadlineData,
  getBlogPostData,
} from 'lib/blog';
import { BlogHeadlineData, BlogPostData } from 'lib/blog-types';
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
import Link from 'next/link';
import Image, { ImageLoaderProps } from 'next/image';
import { visit } from 'unist-util-visit';
import { createImageSet } from 'lib/create-image-set';

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
  background-color: rgba(80, 80, 80, 0.7); /* Black w/ opacity */

  .modal-content {
    margin: auto;
    display: block;
    border-radius: 0.5em;
    max-width: 70%;
    max-height: 80%;
    width: 100%;
    height: auto;
    object-fit: scale-down;
    background: #222;
    box-shadow: 2px 2px 5px black;
  }
  .modal-caption-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
  }
  #modal-caption {
    color: var(--base-color);
    padding: 10px;
    border-radius: 0.5rem;
    background-color: var(--default-bg-color);
    box-shadow: 2px 2px 5px black;
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
    color: var(--base-color);
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

function modalClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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

function showModalImage(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
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
    caption.innerText = (e.target as HTMLImageElement).title;
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

type LinkInfo = {
  id: string;
  category: string;
  title: string;
};

export async function getStaticProps({ params }: { params: { id: string[] } }) {
  const blogPostData = getBlogPostData(params.id[1]);
  const blogHeadlineData = getAllSortedBlogHeadlineData();

  let previous: LinkInfo | null = null;
  let next: LinkInfo | null = null;

  let prevData: BlogHeadlineData | null = null;
  let didFindUs = false;
  blogHeadlineData.every((data) => {
    // Did we find us last time?
    if (didFindUs) {
      // Yes, previous gets whatever
      // data is
      previous = { id: data.id, category: data.category, title: data.title };

      // And we get outta here
      return false;
    }

    // Is this us?
    if (data.id === params.id[1]) {
      // Yes, next gets whatever
      // prevData is
      if (prevData) {
        next = {
          id: prevData?.id,
          category: prevData.category,
          title: prevData.title,
        };
      }

      // Set didFindUs to set
      // previous on the next
      // time through
      didFindUs = true;
    }

    // Remember the previous
    // data
    prevData = data;

    // Keep going
    return true;
  });

  const imageNodes: any[] = [];
  const mdxSource = await serialize(blogPostData.content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [
        remarkSmartypants,
        // Inline plugin to grab info on all
        // images
        () => {
          return (tree: any) => {
            visit(tree, 'image', (node: any) => {
              imageNodes.push(node);
            });
          };
        },
      ],
      rehypePlugins: [
        () => {
          return (tree: any) => {
            visit(tree, 'element', (node: any) => {
              if (node.tagName === 'a') {
                if (node.properties.href.includes('://')) {
                  // Off-page link, make it open in
                  // a new window
                  node.properties.target = '_blank';
                  node.properties.rel = 'noopener noreferrer';
                } else if (!node.properties.href.startsWith('#')) {
                  // Not an off-page link and not
                  // an in-page link, see if it refers to
                  // another blog page
                  const basename = path.basename(node.properties.href);
                  blogHeadlineData.every((data) => {
                    if (data.id === basename) {
                      node.properties.href = `/blog/${data.category}/${data.id}`;
                      return false;
                    }

                    return true;
                  });
                }
              }
            });
          };
        },
        rehypeSlug,
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

  // Process local image nodes
  //   {
  //     type: 'image',
  //     title: 'Corner Park in Winslow, AZ',
  //     url: './IMG_0241.jpg',
  //     alt: 'Winslow AZ',
  //     position: {
  //       start: { line: 6, column: 1, offset: 518 },
  //       end: { line: 6, column: 59, offset: 576 }
  //     }
  //   }
  // This step copies the images to the
  // public folder and populates
  // allImageMetadata with the data that
  // will be needed to create the proper
  // <Image /> tag in render
  const allImageMetadata: any = {};
  for (const node of imageNodes) {
    if (!node.url.includes('://')) {
      try {
        // Create the path to the source image file
        const sourceFilePath = path.posix.join(
          process.cwd(),
          'content/blog',
          blogPostData.id,
          node.url,
        );

        // Create the path to copy the
        // srcset images to
        const destdir = path.posix.join(
          process.cwd(),
          'public',
          'images',
          'blog',
          blogPostData.category,
          blogPostData.id,
        );

        const imageMetadata = await createImageSet(sourceFilePath, destdir);

        // Create string to pass for 'sizes'
        // property on next/image
        let sizes = imageMetadata.imageSet.reduce(
          (prevValue, srcSetProps, idx) => {
            return `${prevValue}${idx !== 0 ? ', ' : ''}(max-width: ${
              srcSetProps.width
            }px) ${srcSetProps.width}px`;
          },
          '',
        );
        const fullSizeSizesEntry = `${imageMetadata.width}px`;
        sizes =
          sizes === '' ? fullSizeSizesEntry : `${sizes}, ${fullSizeSizesEntry}`;

        allImageMetadata[path.basename(node.url)] = {
          ...imageMetadata,
          sizes,
          alt: node.alt,
          title: node.title,
        };
      } catch (err) {
        console.log(
          `blog[${blogPostData.id}]: Error processing image ${node.url}: ${err}`,
        );
      }
    }
  }

  return {
    props: {
      blogPostData,
      allImageMetadata,
      previous,
      next,
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
  allImageMetadata,
  previous,
  next,
  source,
}: {
  blogPostData: BlogPostData;
  allImageMetadata: any;
  previous: LinkInfo | null;
  next: LinkInfo | null;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}): JSX.Element {
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, false);

    // This stuff needs to be done here because
    // otherwise the Prism party starts early
    // (before the initial render has completed)
    // and causes hydration issues
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

  function imageLoader(props: ImageLoaderProps): string {
    const basePath = path.posix.join(
      '/images',
      'blog',
      blogPostData.category,
      blogPostData.id,
    );

    const metadata = allImageMetadata[props.src];

    // Find the first image set entry that
    // is at least as wide as the requested
    // width and return the path to its
    // associated image
    for (let isIdx = 0; isIdx < metadata.imageSet.length; isIdx++) {
      const imageSetProps = metadata.imageSet[isIdx];
      if (imageSetProps.width >= props.width) {
        return `${basePath}/${imageSetProps.filename}`;
      }
    }

    // If we're still here, we didn't find
    // an image that was at least the
    // requested width; return the full
    // size image
    return `${basePath}/${metadata.fullSizeFilename}`;
  }

  const components = {
    img: (props: any) => {
      const metadata = allImageMetadata[path.basename(props.src)];
      if (metadata) {
        return (
          <Image
            loader={imageLoader}
            sizes={metadata.sizes}
            src={metadata.fullSizeFilename}
            alt={metadata.alt}
            width={metadata.width}
            height={metadata.height}
            title={metadata.title}
            placeholder="blur"
            blurDataURL={metadata.imgBase64}
            onClick={showModalImage}
            style={{ cursor: 'pointer' }}
          />
        );
      } else {
        // External image
        return <img {...props}></img>;
      }
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
          <Modal id="image-modal" onClick={modalClick}>
            <span
              className="modal-close"
              id="modal-close"
              onClick={() => modalClose()}
            >
              &times;
            </span>
            <img className="modal-content" id="image-modal-content" alt="" />
            <div className="modal-caption-wrapper">
              <div id="modal-caption"></div>
            </div>
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
                    previous && {
                      target: `/blog/${previous.category}/${previous.id}`,
                      text: previous.title,
                    }
                  }
                  next={
                    next && {
                      target: `/blog/${next.category}/${next.id}`,
                      text: next.title,
                    }
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
                {previous && (
                  <Link
                    href={`/blog/${previous.category}/${previous.id}`}
                    rel="prev"
                  >
                    ← {String(smartquotes(previous.title))}
                  </Link>
                )}
              </NavPrevious>
              <NavNext>
                {next && (
                  <Link href={`/blog/${next.category}/${next.id}`} rel="next">
                    {String(smartquotes(next.title))} →
                  </Link>
                )}
              </NavNext>
            </NavContainer>
          </nav>
        </div>
      }
    />
    // </>
  );
}
