import React, { useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import Img from 'gatsby-image';

const PhotoFlipper = styled.div``;

const PhotoStack = styled.div`
  display: grid;
  .photo-flipper-visible {
  }
  .photo-flipper-hidden {
    display: none;
  }
  .photo-flipper-invisible {
    color: rgba(0, 0, 0, 0);
  }
`;

const Card = styled.div`
  grid-column: 1 / auto;
  grid-row: 1 / auto;
  display: grid;
`;

const CentralCropImage = styled(Img)`
  width: 40%;
  margin: 0.75em;
  grid-column: 1 / auto;
  grid-row: 1 / auto;
  justify-self: start;
  align-self: start;
  z-index: 2;
  border: 1px solid;
  border-color: #787878;
  border-radius: 0.3em;
`;

const FullSizeImage = styled(Img)`
  grid-column: 1 / auto;
  grid-row: 1 / auto;
  z-index: 1;
  width: 100%;
  border-radius: 0.4em;
`;

const ControlBlock = styled.div`
  margin: 1em;
  grid-column: 1 / auto;
  grid-row: 1 / auto;
  justify-self: center;
  align-self: end;
  z-index: 3;
  display: grid;
  grid-template-columns: 3em 3em 3em;
  align-items: center;
  justify-items: stretch;
  border-radius: 0.4em;
  background: rgba(64, 64, 64, 0.75);
`;

const CurrentCardLabel = styled.div`
  grid-column: 2 / auto;
  text-align: middle;
  justify-self: center;
  color: coral;
`;

const CardNavButton = styled.button`
  text-align: middle;
  font-size: 1.5em;
  -webkit-appearance: none;
  background-color: initial;
  border: none;
  color: #787878;
  cursor: pointer;
  outline: none;
`;

const PreviousCardButton = styled(CardNavButton)`
  grid-column: 1 / auto;
`;

const NextCardButton = styled(CardNavButton)`
  grid-column: 3 / auto;
`;

var testPoints = [],
  currentCardIdx = 0;

function showIdx(idx) {
  const element = document.getElementById('photo-flipper-card-' + idx);
  element.classList.remove('photo-flipper-hidden');
  element.classList.add('photo-flipper-visible');
}

function hideIdx(idx) {
  const element = document.getElementById('photo-flipper-card-' + idx);
  element.classList.remove('photo-flipper-visible');
  element.classList.add('photo-flipper-hidden');
}

function updateControlBlock() {
  const currentCardLabel = document.getElementById(
    'photo-flipper-current-card-label',
  );
  if (currentCardLabel) {
    currentCardLabel.innerText = testPoints[currentCardIdx].timeStr;

    if (currentCardIdx === 0) {
      document
        .getElementById('photo-flipper-control-previous-button')
        .classList.add('photo-flipper-invisible');
    } else {
      document
        .getElementById('photo-flipper-control-previous-button')
        .classList.remove('photo-flipper-invisible');
    }

    if (currentCardIdx === testPoints.length - 1) {
      document
        .getElementById('photo-flipper-control-next-button')
        .classList.add('photo-flipper-invisible');
    } else {
      document
        .getElementById('photo-flipper-control-next-button')
        .classList.remove('photo-flipper-invisible');
    }
  } else {
    // Could't grab the current card label from the dom;
    // it must not have updated yet, try again in a quarter second
    setTimeout(updateControlBlock, 250);
  }
}

function onPrevious(e) {
  const oldIdx = currentCardIdx;

  if (currentCardIdx > 0) {
    currentCardIdx--;

    showIdx(currentCardIdx);
    hideIdx(oldIdx);
    updateControlBlock();
  }
}

function onNext(e) {
  const oldIdx = currentCardIdx;

  if (currentCardIdx < testPoints.length - 1) {
    currentCardIdx++;

    showIdx(currentCardIdx);
    hideIdx(oldIdx);
    updateControlBlock();
  }
}

const TestPhotoFlipper = (props) => {
  const data = useStaticQuery(graphql`
    {
      fullSize: allFile(
        filter: {
          relativePath: {
            regex: "/^trouble-with-500-rule/test-exposures/full-size/"
          }
        }
      ) {
        edges {
          node {
            name
            childImageSharp {
              fluid(maxWidth: 1000, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      centralCrop: allFile(
        filter: {
          relativePath: {
            regex: "/^trouble-with-500-rule/test-exposures/central-crop/"
          }
        }
      ) {
        edges {
          node {
            name
            childImageSharp {
              fluid(maxWidth: 1000, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `);

  useEffect(() => {
    showIdx(currentCardIdx);
    updateControlBlock();
  });

  testPoints.length = 0;

  data.fullSize.edges.forEach(({ node }) => {
    var timeStr, time;

    const idxDot = node.name.indexOf('.');
    timeStr = node.name.substring('500-rule-'.length, idxDot);
    time = parseInt(timeStr.substring(0, timeStr.length - 1));
    testPoints.push({
      timeStr: timeStr,
      time: time,
      fullSizeName: node.name,
      fullSizeFluid: node.childImageSharp.fluid,
    });
  });

  data.centralCrop.edges.forEach(({ node }) => {
    var timeStr;

    const idxDot = node.name.indexOf('.');
    timeStr = node.name.substring('500-rule-'.length, idxDot);
    testPoints.forEach((testPoint) => {
      if (testPoint.timeStr === timeStr) {
        testPoint.centralCropName = node.name;
        testPoint.centralCropFluid = node.childImageSharp.fluid;
      }
    });
  });

  testPoints.sort((a, b) => {
    return a.time - b.time;
  });

  return (
    <PhotoFlipper className={props.className}>
      <PhotoStack>
        {testPoints.map((testPoint, idx) => {
          return (
            <Card
              id={'photo-flipper-card-' + idx}
              key={'photo-flipper-card-' + idx}
              className="photo-flipper-hidden"
            >
              <FullSizeImage fluid={testPoint.fullSizeFluid} />
              <CentralCropImage fluid={testPoint.centralCropFluid} />
            </Card>
          );
        })}
        <ControlBlock id="photo-flipper-control-block">
          <PreviousCardButton
            id="photo-flipper-control-previous-button"
            onClick={onPrevious}
          >
            ❮
          </PreviousCardButton>

          <CurrentCardLabel id="photo-flipper-current-card-label" />

          <NextCardButton
            id="photo-flipper-control-next-button"
            onClick={onNext}
          >
            ❯
          </NextCardButton>
        </ControlBlock>
      </PhotoStack>
    </PhotoFlipper>
  );
};

export default TestPhotoFlipper;
