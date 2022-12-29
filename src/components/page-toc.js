import React from 'react';
import styled from 'styled-components';

const TOCWrapper = styled.div`
  color: rgb(160, 160, 160);
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
`;

const TOCTextL2 = styled.div`
  grid-column: 3 / span 1;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  font-size: 0.8em;
  cursor: pointer;
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

class PageTOC extends React.Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };

    this.currentItemIdx = -1;

    this.arrowPts = [
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

    this.removeTextHighlight = this.removeTextHighlight.bind(this);
    this.addTextHighlight = this.addTextHighlight.bind(this);
    this.dumpItems = this.dumpItems.bind(this);
    this.updateGraphics = this.updateGraphics.bind(this);
    this.onBodyScroll = this.onBodyScroll.bind(this);
    this.handleInPageClick = this.handleInPageClick.bind(this);
    this.handleOffPageClick = this.handleOffPageClick.bind(this);
  }

  //
  // Convenience functions for adding/removing
  // highlight classes on elements of the toc
  //

  removeTextHighlight(element) {
    if (element) {
      element.classList.remove('toc-text-highlight');
    }
  }

  addTextHighlight(element) {
    if (element) {
      element.classList.add('toc-text-highlight');
    }
  }

  //
  // For debugging, when necessary
  //

  dumpItems() {
    console.log('start items');
    this.state.items.forEach(function (item, idx) {
      console.log(idx + ': ' + (item.isAbove ? ' above' : ' noabove'));
    });
    console.log('end items');
  }

  //
  // Called by onBodyScroll to update graphics
  //

  updateGraphics() {
    //
    // Off-page nav
    //

    var canvas, ctx;

    // Up
    canvas = document.querySelector('#toc-bullet-props-up');
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
      ctx = canvas.getContext('2d');

      // Compute x/y offset and scale factor
      const xOffset = centerX - halfBoundBoxSide,
        yOffset = centerY - halfBoundBoxSide,
        factor = boundBoxSide;

      // Draw arrow points, scaling/translating
      // as we go
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(120,120,120)';
      ctx.lineWidth = 1.5;
      this.arrowPts.forEach((point) => {
        if ('m' === point.type) {
          ctx.moveTo(point.x * factor + xOffset, point.y * factor + yOffset);
        }
        if ('l' === point.type) {
          ctx.lineTo(point.x * factor + xOffset, point.y * factor + yOffset);
        }
        if ('b' === point.type) {
          ctx.bezierCurveTo(
            point.cp1x * factor + xOffset,
            point.cp1y * factor + yOffset,
            point.cp2x * factor + xOffset,
            point.cp2y * factor + yOffset,
            point.x * factor + xOffset,
            point.y * factor + yOffset,
          );
        }
      });
      ctx.stroke();
    }

    // Previous
    canvas = document.querySelector('#toc-bullet-props-previous');
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
      ctx = canvas.getContext('2d');

      // Compute x/y offset and scale factor
      const xOffset = centerX - halfBoundBoxSide,
        yOffset = centerY - halfBoundBoxSide,
        factor = boundBoxSide;

      // Draw arrow points, scaling/translating
      // (and rotating!) as we go
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(120,120,120)';
      ctx.lineWidth = 1.5;
      this.arrowPts.forEach((point) => {
        if ('m' === point.type) {
          ctx.moveTo(point.y * factor + xOffset, point.x * factor + yOffset);
        }
        if ('l' === point.type) {
          ctx.lineTo(point.y * factor + xOffset, point.x * factor + yOffset);
        }
        if ('b' === point.type) {
          ctx.bezierCurveTo(
            point.cp1y * factor + xOffset,
            point.cp1x * factor + yOffset,
            point.cp2y * factor + xOffset,
            point.cp2x * factor + yOffset,
            point.y * factor + xOffset,
            point.x * factor + yOffset,
          );
        }
      });
      ctx.stroke();
    }

    // Next
    canvas = document.querySelector('#toc-bullet-props-next');
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
      ctx = canvas.getContext('2d');

      // Compute x/y offset and scale factor
      const xOffset = centerX - halfBoundBoxSide,
        yOffset = centerY - halfBoundBoxSide,
        factor = boundBoxSide;

      // Draw arrow points, scaling/translating
      // (and rotating and reflecting!) as we go
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(120,120,120)';
      ctx.lineWidth = 1.5;
      this.arrowPts.forEach((point) => {
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
          ctx.bezierCurveTo(
            (1 - point.cp1y) * factor + xOffset,
            point.cp1x * factor + yOffset,
            (1 - point.cp2y) * factor + xOffset,
            point.cp2x * factor + yOffset,
            (1 - point.y) * factor + xOffset,
            point.x * factor + yOffset,
          );
        }
      });
      ctx.stroke();
    }

    //
    // In-page nav
    //

    this.state.items.forEach((item, idx) => {
      // Determine which lines this link needs
      var hasTopLine = true,
        hasBottomLine = true;
      if (idx === 0) {
        // First item
        hasTopLine = false;
      }
      if (idx === this.state.items.length - 1) {
        // Last item
        hasBottomLine = false;
      }

      // Get the canvas
      canvas = document.querySelector('#toc-bullet-' + item.selector);
      if (canvas) {
        // Set canvas size to match element size
        const bounds = canvas.getBoundingClientRect();
        canvas.width = Math.ceil(bounds.width);
        canvas.height = Math.ceil(bounds.height);

        // Calculate some dimensions
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        var radius = centerX * 0.65;
        var fillRadius = radius * 0.5;

        // Adjust radius for l2
        if (item.levelInd === 'l2') {
          radius = radius * 0.8;
          fillRadius = fillRadius * 0.8;
        }

        // Get a context
        ctx = canvas.getContext('2d');

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
        if (idx === this.currentItemIdx) {
          ctx.beginPath();
          ctx.fillStyle = 'coral';
          ctx.arc(centerX, centerY, fillRadius, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });
  }

  //
  // Called when scrolled
  //

  onBodyScroll() {
    // Make the magic line (the horizontal point where
    // the target element needs to pass for the
    // highlight to change) to the width of our main
    // element. In other words, if you made a square at
    // the top of the main toc element, the magic line
    // will be at the bottom of that square
    const magicLine = document
      .querySelector('#page-toc')
      .getBoundingClientRect().width;

    // Iterate all the elements we're tracking and see
    // where they stand relative to the magic line. At
    // the end of the iteration, changed will be true
    // if any elements changed position (above/below)
    // relative to the magic line and lastAboveIdx
    // will have the index of the last element above
    // the magic line (the one to be highlighted)
    var changed = false,
      lastAboveIdx = -1;
    this.state.items.forEach(function (item, idx) {
      var letsGetRect = item.target.getBoundingClientRect();

      // Is an part of the item above the magic line?
      const isAbove = letsGetRect.top < magicLine;
      if (isAbove) {
        lastAboveIdx = idx;
      }

      if (isAbove !== item.isAbove) {
        changed = true;
        item.isAbove = isAbove;
      }
    });

    // Update the UI if anything has changed
    if (changed || lastAboveIdx !== this.currentItemIdx) {
      if (this.currentItemIdx !== lastAboveIdx) {
        if (this.currentItemIdx !== -1) {
          this.removeTextHighlight(
            document.querySelector(
              '#toc-text-' + this.state.items[this.currentItemIdx].selector,
            ),
          );
        }
        if (lastAboveIdx !== -1) {
          this.addTextHighlight(
            document.querySelector(
              '#toc-text-' + this.state.items[lastAboveIdx].selector,
            ),
          );
        }
        this.currentItemIdx = lastAboveIdx;
      }
    }

    // Update graphics (every time)
    this.updateGraphics();
  }

  componentDidMount() {
    // Finds all heading elements spit out by the MDX
    // parser
    var anchors = document.getElementsByClassName('anchor');

    // Some vars
    var i,
      levelInd = 'l1',
      items = [];

    // Add the first element to the TOC, the top!
    var target = document.querySelector('#post-header');
    if (target) {
      items.push({
        target: target,
        isAbove: false,
        selector: target.id,
        levelInd: 'l1',
        hash: '#post-header',
      });
    }

    // Iterate the headings from MDX and create
    // the remaining elements of the TOC by
    // scraping their contents
    for (i = 0; i < anchors.length; i++) {
      if (anchors[i].parentElement.tagName.startsWith('H')) {
        const level = anchors[i].parentElement.tagName.substring(1);
        if (level === '3') {
          levelInd = 'l1';
        } else if (level === '4') {
          levelInd = 'l2';
        }

        items.push({
          target: anchors[i].parentElement,
          isAbove: false,
          selector: anchors[i].parentElement.id,
          levelInd: levelInd,
          hash: anchors[i].hash,
        });
      }
    }

    // Hook up our event handler to onscroll
    // and window resize. Only when one
    // of these events fires can the
    // highlighted TOC item be changed
    document.body.onscroll = this.onBodyScroll;
    window.onresize = this.onBodyScroll;

    // Change our state so we get redrawn
    this.setState({ items });
  }

  componentDidUpdate() {
    // Kick things once the page renders to
    // set the initial highlight (if there
    // is html)
    if (this.state.items.length !== 0) {
      this.onBodyScroll();
    }
  }

  componentWillUnmount() {
    // Be a good citizen and clean up
    document.body.onscroll = null;
    window.onresize = null;
    this.currentItemIdx = -1;
  }

  //
  // Called when an in-page item is clicked
  // (bullet or text)
  //

  handleInPageClick(e) {
    // Try to find the item
    this.state.items.forEach((item) => {
      if (
        'toc-bullet-' + item.selector === e.nativeEvent.target.id ||
        'toc-text-' + item.selector === e.nativeEvent.target.id
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

  handleOffPageClick(e) {
    // Handle "up" nav
    if (
      'toc-bullet-props-up' === e.nativeEvent.target.id ||
      'toc-text-props-up' === e.nativeEvent.target.id ||
      'toc-offpage-text-props-up' === e.nativeEvent.target.id
    ) {
      window.location.href = this.props.up.target;
    }

    // Handle "previous" nav
    if (
      'toc-bullet-props-previous' === e.nativeEvent.target.id ||
      'toc-text-props-previous' === e.nativeEvent.target.id ||
      'toc-offpage-text-props-previous' === e.nativeEvent.target.id ||
      'toc-text-ref-props-previous' === e.nativeEvent.target.id
    ) {
      window.location.href = this.props.previous.target;
    }

    // Handle "next" nav
    if (
      'toc-bullet-props-next' === e.nativeEvent.target.id ||
      'toc-text-props-next' === e.nativeEvent.target.id ||
      'toc-offpage-text-props-next' === e.nativeEvent.target.id ||
      'toc-text-ref-props-next' === e.nativeEvent.target.id
    ) {
      window.location.href = this.props.next.target;
    }
  }

  render() {
    // Your TOC, sir...
    // Added key prop to everything to finally get
    // react to stop overreacting to my lack of
    // keys. This list never changes, so the keys
    // are pretty irrelevant, but there's no telling
    // react that. This keeps it quiet (shhhh)
    var row = 1;
    return (
      <TOCWrapper id="page-toc" key="page-toc" className={this.props.className}>
        {this.props.up && (
          <React.Fragment key="toc-fragment-props-up">
            <TOCBullet
              className="toc-row-l1"
              id="toc-bullet-props-up"
              key="toc-bullet-props-up"
              style={{ gridRow: row }}
              onClick={this.handleOffPageClick}
            />
            <TOCTextL1
              className="toc-row-l1"
              id="toc-text-props-up"
              key="toc-text-props-up"
              style={{ gridRow: row++ }}
              onClick={this.handleOffPageClick}
            >
              <OffPageText
                id="toc-offpage-text-props-up"
                key="toc-offpage-text-props-up"
              >
                {this.props.up.text}
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
        {this.state.items.map((item, idx) => (
          <React.Fragment key={'toc-fragment-' + item.selector}>
            <TOCBullet
              className={'toc-row-' + item.levelInd}
              id={'toc-bullet-' + item.selector}
              key={'toc-bullet-' + item.selector}
              style={{ gridRow: row }}
              onClick={this.handleInPageClick}
            />
            {item.levelInd === 'l1' ? (
              <TOCTextL1
                className={'toc-row-' + item.levelInd}
                id={'toc-text-' + item.selector}
                key={'toc-text-' + item.selector}
                style={{ gridRow: row++ }}
                onClick={this.handleInPageClick}
              >
                {idx === 0 ? 'Intro' : item.target.innerText}
              </TOCTextL1>
            ) : (
              <TOCTextL2
                className={'toc-row-' + item.levelInd}
                id={'toc-text-' + item.selector}
                key={'toc-text-' + item.selector}
                style={{ gridRow: row++ }}
                onClick={this.handleInPageClick}
              >
                {idx === 0 ? 'Intro' : item.target.innerText}
              </TOCTextL2>
            )}
          </React.Fragment>
        ))}
        {this.props.previous && (
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
              onClick={this.handleOffPageClick}
            />
            <TOCTextL1
              className="toc-row-l1"
              id="toc-text-props-previous"
              key="toc-text-props-previous"
              style={{ gridRow: row++ }}
              onClick={this.handleOffPageClick}
            >
              <OffPageText
                id="toc-offpage-text-props-previous"
                key="toc-offpage-text-props-previous"
              >
                Previous Article
              </OffPageText>
              <ArticleRef id="toc-text-ref-props-previous">
                {this.props.previous.text}
              </ArticleRef>
            </TOCTextL1>
          </React.Fragment>
        )}
        {this.props.next && (
          <React.Fragment key="toc-fragment-props-next">
            {!this.props.previous && (
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
              onClick={this.handleOffPageClick}
            />
            <TOCTextL1
              className="toc-row-l1"
              id="toc-text-props-next"
              key="toc-text-props-next"
              style={{ gridRow: row++ }}
              onClick={this.handleOffPageClick}
            >
              <OffPageText
                id="toc-offpage-text-props-next"
                key="toc-offpage-text-props-next"
              >
                Next Article
              </OffPageText>
              <ArticleRef id="toc-text-ref-props-next">
                {this.props.next.text}
              </ArticleRef>
            </TOCTextL1>
          </React.Fragment>
        )}
      </TOCWrapper>
    );
  }
}

export default PageTOC;
