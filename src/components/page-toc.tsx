import { useState, useEffect, SyntheticEvent, useCallback } from 'react';
import styled from '@emotion/styled';
import React from 'react';
import isEqual from 'lodash.isequal';

const TOCWrapper = styled.div`
  color: var(--text-color-dim);
  display: grid;
  grid-template-columns: auto 0.2em auto;
  grid-column-gap: 0.5em;
  align-items: center;
  font-family: 'Dosis', sans-serif;
  font-weight: 300;
  .toc-bullet-highlight {
    display: initial;
  }
  .toc-text-highlight {
    color: coral;
    font-weight: 400;
  }
`;

const TOCTextL1 = styled.div`
  grid-column: 2 / span 2;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  cursor: pointer;
  &:hover:not(.toc-text-highlight) {
    color: var(--accent-color);
  }
`;

const TOCTextL2 = styled.div`
  grid-column: 3 / span 1;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  font-size: 0.8em;
  cursor: pointer;
  &:hover:not(.toc-text-highlight) {
    color: var(--accent-color);
  }
`;

const TOCBullet = styled.canvas`
  grid-column: 1 / span 1;
  justify-self: center;
  align-self: stretch;
  width: 1.6em;
  cursor: pointer;
`;

const ArticleRef = styled.p`
  color: coral;
  font-size: 0.8em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin: auto;
`;

const TOCSpacer = styled.div`
  grid-column: 1 / span 3;
  height: 1em;
`;

const OffPageText = styled.p`
  font-weight: 400;
  margin: auto;
`;

type BezierPoint = {
  type: string;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  x: number;
  y: number;
};

const arrowPts = [
  { type: 'm', x: 0.5002237518, y: 0.1206341765 },
  {
    type: 'b',
    cp1x: 0.5246020415,
    cp1y: 0.1206341765,
    cp2x: 0.5417776547,
    cp2y: 0.1355509621,
    x: 0.5573550408,
    y: 0.15379206,
  },
  {
    type: 'b',
    cp1x: 0.572932427,
    cp1y: 0.1720331579,
    cp2x: 0.94154751,
    cp2y: 0.5812645172,
    x: 0.9548021395,
    y: 0.5954141539,
  },
  {
    type: 'b',
    cp1x: 1,
    cp1y: 0.6435527521,
    cp2x: 0.9594476527,
    cp2y: 0.6870458372,
    x: 0.9329383937,
    y: 0.6870458372,
  },
  { type: 'l', x: 0.7728386643, y: 0.6870458372 },
  {
    type: 'b',
    cp1x: 0.7478637032,
    cp1y: 0.6870458372,
    cp2x: 0.7315830972,
    cp2y: 0.6937157713,
    x: 0.7315830972,
    y: 0.730965116,
  },
  {
    type: 'b',
    cp1x: 0.7315830972,
    cp1y: 0.7682144608,
    cp2x: 0.7313273808,
    cp2y: 0.7942335969,
    x: 0.7313273808,
    y: 0.830758412,
  },
  {
    type: 'b',
    cp1x: 0.7313273808,
    cp1y: 0.8672832271,
    cp2x: 0.7017069065,
    cp2y: 0.8793658235,
    x: 0.6856820167,
    y: 0.8793658235,
  },
  { type: 'l', x: 0.3137213118, y: 0.8793658235 },
  {
    type: 'b',
    cp1x: 0.2976964221,
    cp1y: 0.8793658235,
    cp2x: 0.2680972574,
    cp2y: 0.8672832271,
    x: 0.2680972574,
    y: 0.830758412,
  },
  {
    type: 'b',
    cp1x: 0.2680972574,
    cp1y: 0.7942335969,
    cp2x: 0.2683742835,
    cp2y: 0.7682357705,
    x: 0.2683742835,
    y: 0.730965116,
  },
  {
    type: 'b',
    cp1x: 0.2680972574,
    cp1y: 0.7942335969,
    cp2x: 0.2683742835,
    cp2y: 0.7682357705,
    x: 0.2683742835,
    y: 0.730965116,
  },
  { type: 'l', x: 0.06706160632, y: 0.6870458372 },
  {
    type: 'b',
    cp1x: 0.04055234726,
    cp1y: 0.6870458372,
    cp2x: 0,
    cp2y: 0.6435101328,
    x: 0.04519786051,
    y: 0.5954141539,
  },
  {
    type: 'b',
    cp1x: 0.02009504123,
    cp1y: 0.5812645172,
    cp2x: 0.4270462633,
    cp2y: 0.1720118482,
    x: 0.4042875104,
    y: 0.1537494406,
  },
  {
    type: 'b',
    cp1x: 0.3815287574,
    cp1y: 0.1354870331,
    cp2x: 0.4753553391,
    cp2y: 0.1206341765,
    x: 0.4996483901,
    y: 0.1206341765,
  },
];

type ItemData = {
  target: HTMLElement;
  selector: string;
  levelInd: string;
  hash: string;
};

const PageTOC = (props: any) => {
  const [items, setItems] = useState([] as ItemData[]);
  const [currentItemIdx, setCurrentItemIdx] = useState(-1);

  //
  // Called by onBodyScroll to update graphics
  //

  const updateGraphics = useCallback(() => {
    //
    // Off-page nav
    //

    // Up
    let canvas = document.querySelector(
      '#toc-bullet-props-up',
    ) as HTMLCanvasElement;
    if (canvas) {
      // Set canvas size to match element size
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.ceil(bounds.width);
      canvas.height = Math.ceil(bounds.height);

      // Calculate some dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boundBoxSide = canvas.width * 0.65;
      const halfBoundBoxSide = boundBoxSide / 2;

      // Get a context
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Compute x/y offset and scale factor
        const xOffset = centerX - halfBoundBoxSide,
          yOffset = centerY - halfBoundBoxSide,
          factor = boundBoxSide;

        // Draw arrow points, scaling/translating
        // as we go
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(120,120,120)';
        ctx.lineWidth = 1.5;
        arrowPts.forEach((point) => {
          if ('m' === point.type) {
            ctx.moveTo(point.x * factor + xOffset, point.y * factor + yOffset);
          }
          if ('l' === point.type) {
            ctx.lineTo(point.x * factor + xOffset, point.y * factor + yOffset);
          }
          if ('b' === point.type) {
            const bPoint = point as BezierPoint;
            ctx.bezierCurveTo(
              bPoint.cp1x * factor + xOffset,
              bPoint.cp1y * factor + yOffset,
              bPoint.cp2x * factor + xOffset,
              bPoint.cp2y * factor + yOffset,
              bPoint.x * factor + xOffset,
              bPoint.y * factor + yOffset,
            );
          }
        });
        ctx.stroke();
      }
    }

    // Previous
    canvas = document.querySelector(
      '#toc-bullet-props-previous',
    ) as HTMLCanvasElement;
    if (canvas) {
      // Set canvas size to match element size
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.ceil(bounds.width);
      canvas.height = Math.ceil(bounds.height);

      // Calculate some dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boundBoxSide = canvas.width * 0.65;
      const halfBoundBoxSide = boundBoxSide / 2;

      // Get a context
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Compute x/y offset and scale factor
        const xOffset = centerX - halfBoundBoxSide,
          yOffset = centerY - halfBoundBoxSide,
          factor = boundBoxSide;

        // Draw arrow points, scaling/translating
        // (and rotating!) as we go
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(120,120,120)';
        ctx.lineWidth = 1.5;
        arrowPts.forEach((point) => {
          if ('m' === point.type) {
            ctx.moveTo(point.y * factor + xOffset, point.x * factor + yOffset);
          }
          if ('l' === point.type) {
            ctx.lineTo(point.y * factor + xOffset, point.x * factor + yOffset);
          }
          if ('b' === point.type) {
            const bPoint = point as BezierPoint;
            ctx.bezierCurveTo(
              bPoint.cp1y * factor + xOffset,
              bPoint.cp1x * factor + yOffset,
              bPoint.cp2y * factor + xOffset,
              bPoint.cp2x * factor + yOffset,
              bPoint.y * factor + xOffset,
              bPoint.x * factor + yOffset,
            );
          }
        });
        ctx.stroke();
      }
    }

    // Next
    canvas = document.querySelector(
      '#toc-bullet-props-next',
    ) as HTMLCanvasElement;
    if (canvas) {
      // Set canvas size to match element size
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.ceil(bounds.width);
      canvas.height = Math.ceil(bounds.height);

      // Calculate some dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boundBoxSide = canvas.width * 0.65;
      const halfBoundBoxSide = boundBoxSide / 2;

      // Get a context
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Compute x/y offset and scale factor
        const xOffset = centerX - halfBoundBoxSide,
          yOffset = centerY - halfBoundBoxSide,
          factor = boundBoxSide;

        // Draw arrow points, scaling/translating
        // (and rotating and reflecting!) as we go
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(120,120,120)';
        ctx.lineWidth = 1.5;
        arrowPts.forEach((point) => {
          if ('m' === point.type) {
            ctx.moveTo(
              (1 - point.y) * factor + xOffset,
              point.x * factor + yOffset,
            );
          }
          if ('l' === point.type) {
            ctx.lineTo(
              (1 - point.y) * factor + xOffset,
              point.x * factor + yOffset,
            );
          }
          if ('b' === point.type) {
            const bPoint = point as BezierPoint;
            ctx.bezierCurveTo(
              (1 - bPoint.cp1y) * factor + xOffset,
              bPoint.cp1x * factor + yOffset,
              (1 - bPoint.cp2y) * factor + xOffset,
              bPoint.cp2x * factor + yOffset,
              (1 - bPoint.y) * factor + xOffset,
              bPoint.x * factor + yOffset,
            );
          }
        });
        ctx.stroke();
      }
    }

    //
    // In-page nav
    //

    items.forEach((item, idx) => {
      // Determine which lines this link needs
      let hasTopLine = true,
        hasBottomLine = true;
      if (idx === 0) {
        // First item
        hasTopLine = false;
      }
      if (idx === items.length - 1) {
        // Last item
        hasBottomLine = false;
      }

      // Get the canvas
      canvas = document.querySelector(
        '#toc-bullet-' + item.selector,
      ) as HTMLCanvasElement;
      if (canvas) {
        // Set canvas size to match element size
        const bounds = canvas.getBoundingClientRect();
        canvas.width = Math.ceil(bounds.width);
        canvas.height = Math.ceil(bounds.height);

        // Calculate some dimensions
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let radius = centerX * 0.65;
        let fillRadius = radius * 0.5;

        // Adjust radius for l2
        if (item.levelInd === 'l2') {
          radius = radius * 0.8;
          fillRadius = fillRadius * 0.8;
        }

        // Get a context
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Draw link(s) to neighbor(s)
          ctx.beginPath();
          ctx.strokeStyle = 'rgb(64,64,64)';
          ctx.lineWidth = 1;
          if (hasTopLine) {
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, centerY - radius);
          }
          if (hasBottomLine) {
            ctx.moveTo(centerX, centerY + radius);
            ctx.lineTo(centerX, canvas.height);
          }
          ctx.stroke();

          // Draw circle
          ctx.beginPath();
          ctx.strokeStyle = 'rgb(96,96,96)';
          ctx.lineWidth = 1.5;
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();

          // Fill link in if this is the current item
          if (idx === currentItemIdx) {
            ctx.beginPath();
            ctx.fillStyle = 'coral';
            ctx.arc(centerX, centerY, fillRadius, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    });
  }, [items, currentItemIdx]);

  //
  // Convenience functions for adding/removing
  // highlight classes on elements of the toc
  //

  function removeTextHighlight(element: HTMLElement | null) {
    if (element) {
      element.classList.remove('toc-text-highlight');
    }
  }

  function addTextHighlight(element: HTMLElement | null) {
    if (element) {
      element.classList.add('toc-text-highlight');
    }
  }

  //
  // Called when scrolled
  //

  const onBodyScroll = useCallback(() => {
    // Make the magic line (the horizontal point where
    // the target element needs to pass for the
    // highlight to change) to the width of our main
    // element. In other words, if you made a square at
    // the top of the main toc element, the magic line
    // will be at the bottom of that square
    const magicLine = document
      .querySelector('#page-toc')
      ?.getBoundingClientRect().width;

    if (magicLine) {
      // Iterate all the elements we're tracking and see
      // where they stand relative to the magic line. At
      // the end of the iteration, changed will be true
      // if any elements changed position (above/below)
      // relative to the magic line and lastAboveIdx
      // will have the index of the last element above
      // the magic line (the one to be highlighted)
      let lastAboveIdx = -1;
      items.forEach(function (item, idx) {
        const letsGetRect = item.target.getBoundingClientRect();

        // Is any part of the item above the magic line?
        const isAbove = letsGetRect.top < magicLine;
        if (isAbove) {
          lastAboveIdx = idx;
        }
      });

      // Update the UI if anything has changed
      setCurrentItemIdx((prevIdx) => {
        if (prevIdx !== lastAboveIdx) {
          if (prevIdx !== -1) {
            removeTextHighlight(
              document.querySelector(`#toc-text-${items[prevIdx].selector}`),
            );
          }

          if (lastAboveIdx !== -1) {
            addTextHighlight(
              document.querySelector(
                `#toc-text-${items[lastAboveIdx].selector}`,
              ),
            );
          }
        }

        return lastAboveIdx;
      });
    }
  }, [items, currentItemIdx]);

  useEffect(() => {
    // Finds all heading elements spit out by the MDX
    // parser
    const anchors = document.getElementsByClassName('anchor');

    // Some vars
    let i,
      levelInd = 'l1';
    const newItems = [] as ItemData[];

    // Add the first element to the TOC, the top!
    const target = document.querySelector('#post-header') as HTMLElement;
    if (target) {
      newItems.push({
        target,
        selector: target.id,
        levelInd: 'l1',
        hash: '#post-header',
      });
    }

    // Iterate the headings from MDX and create
    // the remaining elements of the TOC by
    // scraping their contents
    for (i = 0; i < anchors.length; i++) {
      const parent = anchors[i].parentElement as HTMLElement;
      if (parent && parent.tagName.startsWith('H')) {
        const level = parent.tagName.substring(1);
        if (level === '3') {
          levelInd = 'l1';
        } else if (level === '4') {
          levelInd = 'l2';
        }

        newItems.push({
          target: parent,
          selector: parent?.id,
          levelInd: levelInd,
          hash: `#${anchors[i].id}`,
        });
      }
    }

    // Hook up our event handler to onscroll
    // and window resize. Only when one
    // of these events fires can the
    // highlighted TOC item be changed
    document.body.onscroll = onBodyScroll;
    window.onresize = onBodyScroll;

    // Change our state so we get redrawn
    setItems((items) => {
      if (!isEqual(items, newItems)) {
        return newItems;
      } else {
        return items;
      }
    });

    return () => {
      // Be a good citizen and clean up
      document.body.onscroll = null;
      window.onresize = null;
    };
  }, [onBodyScroll]);

  useEffect(() => {
    if (items.length !== 0) {
      onBodyScroll();
    }
  }, [items, onBodyScroll]);

  useEffect(() => {
    updateGraphics();
  }, [currentItemIdx, updateGraphics]);

  //
  // Called when an in-page item is clicked
  // (bullet or text)
  //

  function handleInPageClick(e: SyntheticEvent) {
    // Try to find the item
    items.forEach((item) => {
      if (
        'toc-bullet-' + item.selector ===
          (e.nativeEvent.target as HTMLElement)?.id ||
        'toc-text-' + item.selector ===
          (e.nativeEvent.target as HTMLElement)?.id
      ) {
        // Found it; scroll to its target
        window.scrollBy({
          top: item.target.getBoundingClientRect().top,
          behavior: 'smooth',
        });
      }
    });
  }

  //
  // Called when an off-page item is clicked
  // (bullet or text)
  //

  function handleOffPageClick(e: SyntheticEvent) {
    const target = e.nativeEvent.target as HTMLElement;

    if (target) {
      // Handle "up" nav
      if (
        'toc-bullet-props-up' === target.id ||
        'toc-text-props-up' === target.id ||
        'toc-offpage-text-props-up' === target.id
      ) {
        window.location.href = props.up.target;
      }

      // Handle "previous" nav
      if (
        'toc-bullet-props-previous' === target.id ||
        'toc-text-props-previous' === target.id ||
        'toc-offpage-text-props-previous' === target.id ||
        'toc-text-ref-props-previous' === target.id
      ) {
        window.location.href = props.previous.target;
      }

      // Handle "next" nav
      if (
        'toc-bullet-props-next' === target.id ||
        'toc-text-props-next' === target.id ||
        'toc-offpage-text-props-next' === target.id ||
        'toc-text-ref-props-next' === target.id
      ) {
        window.location.href = props.next.target;
      }
    }
  }

  // Your TOC, sir...
  // Added key prop to everything to finally get
  // react to stop overreacting to my lack of
  // keys. This list never changes, so the keys
  // are pretty irrelevant, but there's no telling
  // react that. This keeps it quiet (shhhh)
  let row = 1;
  return (
    <TOCWrapper id="page-toc" key="page-toc" className={props.className}>
      {props.up && (
        <React.Fragment key="toc-fragment-props-up">
          <TOCBullet
            className="toc-row-l1"
            id="toc-bullet-props-up"
            key="toc-bullet-props-up"
            style={{ gridRow: row }}
            onClick={handleOffPageClick}
          />
          <TOCTextL1
            className="toc-row-l1"
            id="toc-text-props-up"
            key="toc-text-props-up"
            style={{ gridRow: row++ }}
            onClick={handleOffPageClick}
          >
            <OffPageText
              id="toc-offpage-text-props-up"
              key="toc-offpage-text-props-up"
            >
              {props.up.text}
            </OffPageText>
          </TOCTextL1>
          <TOCSpacer
            className="toc-spacer toc-spacer-top"
            key="toc-spacer-top"
            id="toc-spacer-top"
            style={{ gridRow: row++ }}
          />
        </React.Fragment>
      )}
      {items.map((item, idx) => (
        <React.Fragment key={'toc-fragment-' + item.selector}>
          <TOCBullet
            className={'toc-row-' + item.levelInd}
            id={'toc-bullet-' + item.selector}
            key={'toc-bullet-' + item.selector}
            style={{ gridRow: row }}
            onClick={handleInPageClick}
          />
          {item.levelInd === 'l1' ? (
            <TOCTextL1
              className={'toc-row-' + item.levelInd}
              id={'toc-text-' + item.selector}
              key={'toc-text-' + item.selector}
              style={{ gridRow: row++ }}
              onClick={handleInPageClick}
            >
              {idx === 0 ? 'Intro' : item.target.innerText}
            </TOCTextL1>
          ) : (
            <TOCTextL2
              className={'toc-row-' + item.levelInd}
              id={'toc-text-' + item.selector}
              key={'toc-text-' + item.selector}
              style={{ gridRow: row++ }}
              onClick={handleInPageClick}
            >
              {idx === 0 ? 'Intro' : item.target.innerText}
            </TOCTextL2>
          )}
        </React.Fragment>
      ))}
      {props.previous && (
        <React.Fragment key="toc-fragment-props-previous">
          <TOCSpacer
            className="toc-spacer toc-spacer-bottom"
            key="toc-spacer-bottom"
            id="toc-spacer-bottom"
            style={{ gridRow: row++ }}
          />
          <TOCBullet
            className="toc-row-l1"
            id="toc-bullet-props-previous"
            key="toc-bullet-props-previous"
            style={{ gridRow: row }}
            onClick={handleOffPageClick}
          />
          <TOCTextL1
            className="toc-row-l1"
            id="toc-text-props-previous"
            key="toc-text-props-previous"
            style={{ gridRow: row++ }}
            onClick={handleOffPageClick}
          >
            <OffPageText
              id="toc-offpage-text-props-previous"
              key="toc-offpage-text-props-previous"
            >
              Previous Article
            </OffPageText>
            <ArticleRef id="toc-text-ref-props-previous">
              {props.previous.text}
            </ArticleRef>
          </TOCTextL1>
        </React.Fragment>
      )}
      {props.next && (
        <React.Fragment key="toc-fragment-props-next">
          {!props.previous && (
            <TOCSpacer
              className="toc-spacer toc-spacer-bottom"
              key="toc-spacer-bottom"
              id="toc-spacer-bottom"
              style={{ gridRow: row++ }}
            />
          )}
          <TOCBullet
            className="toc-row-l1"
            id="toc-bullet-props-next"
            key="toc-bullet-props-next"
            style={{ gridRow: row }}
            onClick={handleOffPageClick}
          />
          <TOCTextL1
            className="toc-row-l1"
            id="toc-text-props-next"
            key="toc-text-props-next"
            style={{ gridRow: row++ }}
            onClick={handleOffPageClick}
          >
            <OffPageText
              id="toc-offpage-text-props-next"
              key="toc-offpage-text-props-next"
            >
              Next Article
            </OffPageText>
            <ArticleRef id="toc-text-ref-props-next">
              {props.next.text}
            </ArticleRef>
          </TOCTextL1>
        </React.Fragment>
      )}
    </TOCWrapper>
  );
};

export default PageTOC;
