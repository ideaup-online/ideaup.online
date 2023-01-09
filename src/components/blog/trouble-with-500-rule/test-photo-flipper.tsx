import React, { useCallback, useEffect, useState } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import styled from '@emotion/styled';
import jsonProps from './test-photo-flipper-props.json';

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

const CentralCropImage = styled(Image)`
  width: 40%;
  height: auto;
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

const FullSizeImage = styled(Image)`
  grid-column: 1 / auto;
  grid-row: 1 / auto;
  z-index: 1;
  width: 100%;
  height: auto;
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
  color: var(--base-color);
`;

const CardNavButton = styled.button`
  text-align: middle;
  font-size: 1.5em;
  -webkit-appearance: none;
  background-color: initial;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  outline: none;
`;

const PreviousCardButton = styled(CardNavButton)`
  grid-column: 1 / auto;
`;

const NextCardButton = styled(CardNavButton)`
  grid-column: 3 / auto;
`;

const TestPhotoFlipper = (props: any): JSX.Element => {
  const [currentCardIdx, setCurrentCardIdx] = useState(0);

  const testPoints = [] as any;

  const path = require('path');

  function imageLoader(props: ImageLoaderProps): string {
    const fullSizeBasePath = '/images/component/test-photo-flipper/full-size';
    const centralCropBasePath =
      '/images/component/test-photo-flipper/central-crop';

    const dirname = path.dirname(props.src);
    const filename = path.basename(props.src);

    if (dirname === 'full-size') {
      for (let fsIdx = 0; fsIdx < jsonProps.fullSize.length; fsIdx++) {
        const fullSizeProps = jsonProps.fullSize[fsIdx];
        if (fullSizeProps.fullSizeFilename === filename) {
          // Find the first image set entry that
          // is at least as wide as the requested
          // width and return the path to its
          // associated image
          for (let isIdx = 0; isIdx < fullSizeProps.imageSet.length; isIdx++) {
            const imageSetProps = fullSizeProps.imageSet[isIdx];
            if (imageSetProps.width >= props.width) {
              return `${fullSizeBasePath}/${imageSetProps.filename}`;
            }
          }

          // If we're still here, we didn't find
          // an image that was at least the
          // requested width; return the full
          // size image
          return `${fullSizeBasePath}/${fullSizeProps.fullSizeFilename}`;
        }
      }
    } else if (dirname === 'central-crop') {
      for (let ccIdx = 0; ccIdx < jsonProps.centralCrop.length; ccIdx++) {
        const centralCropProps = jsonProps.centralCrop[ccIdx];
        if (centralCropProps.fullSizeFilename === filename) {
          // Find the first image set entry that
          // is at least as wide as the requested
          // width and return the path to its
          // associated image
          for (
            let isIdx = 0;
            isIdx < centralCropProps.imageSet.length;
            isIdx++
          ) {
            const imageSetProps = centralCropProps.imageSet[isIdx];
            if (imageSetProps.width >= props.width) {
              return `${centralCropBasePath}/${imageSetProps.filename}`;
            }
          }

          // If we're still here, we didn't find
          // an image that was at least the
          // requested width; return the full
          // size image
          return `${centralCropBasePath}/${centralCropProps.fullSizeFilename}`;
        }
      }
    }

    console.log(`Unknown dir: ${dirname}`);
    return '';
  }

  function showIdx(idx: number) {
    const element = document.getElementById('photo-flipper-card-' + idx);
    element?.classList.remove('photo-flipper-hidden');
    element?.classList.add('photo-flipper-visible');
  }

  function hideIdx(idx: number) {
    const element = document.getElementById('photo-flipper-card-' + idx);
    element?.classList.remove('photo-flipper-visible');
    element?.classList.add('photo-flipper-hidden');
  }

  const updateControlBlock = useCallback(() => {
    const currentCardLabel = document.getElementById(
      'photo-flipper-current-card-label',
    );
    if (currentCardLabel) {
      currentCardLabel.innerText = testPoints[currentCardIdx].timeStr;

      if (currentCardIdx === 0) {
        document
          .getElementById('photo-flipper-control-previous-button')
          ?.classList.add('photo-flipper-invisible');
      } else {
        document
          .getElementById('photo-flipper-control-previous-button')
          ?.classList.remove('photo-flipper-invisible');
      }

      if (currentCardIdx === testPoints.length - 1) {
        document
          .getElementById('photo-flipper-control-next-button')
          ?.classList.add('photo-flipper-invisible');
      } else {
        document
          .getElementById('photo-flipper-control-next-button')
          ?.classList.remove('photo-flipper-invisible');
      }
    } else {
      // Could't grab the current card label from the dom;
      // it must not have updated yet, try again in a quarter second
      setTimeout(updateControlBlock, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardIdx]);

  function onPrevious() {
    setCurrentCardIdx((prevValue: number): number => {
      if (prevValue > 0) {
        hideIdx(prevValue);

        return prevValue - 1;
      } else {
        return prevValue;
      }
    });
  }

  function onNext() {
    setCurrentCardIdx((prevValue: number): number => {
      if (prevValue < testPoints.length - 1) {
        hideIdx(prevValue);
        return prevValue + 1;
      } else {
        return prevValue;
      }
    });
  }

  useEffect(() => {
    showIdx(currentCardIdx);
    updateControlBlock();
  }, [currentCardIdx, updateControlBlock]);

  jsonProps.fullSize.forEach((imageProps) => {
    const file = path.basename(imageProps.fullSizeFilename);
    const idxDot = file.indexOf('.');
    const timeStr = file.substring('500-rule-'.length, idxDot);
    const time = parseInt(timeStr.substring(0, timeStr.length - 1));
    let sizes = imageProps.imageSet.reduce((prevValue, srcSetProps, idx) => {
      return `${prevValue}${idx !== 0 ? ', ' : ''}(max-width: ${
        srcSetProps.width
      }px) ${srcSetProps.width}px`;
    }, '');
    const fullSizeSizesEntry = `${imageProps.width}px`;
    sizes =
      sizes === '' ? fullSizeSizesEntry : `${sizes}, ${fullSizeSizesEntry}`;
    testPoints.push({
      timeStr: timeStr,
      time: time,
      fullSizeSrc: `full-size/${imageProps.fullSizeFilename}`,
      fullSizeWidth: imageProps.width,
      fullSizeHeight: imageProps.height,
      fullSizeImgBase64: imageProps.imgBase64,
      fullSizeSizes: sizes,
    });
  });

  jsonProps.centralCrop.forEach((imageProps) => {
    const file = path.basename(imageProps.fullSizeFilename);
    const idxDot = file.indexOf('.');
    const timeStr = file.substring('500-rule-'.length, idxDot);
    let sizes = imageProps.imageSet.reduce((prevValue, srcSetProps, idx) => {
      return `${prevValue}${idx !== 0 ? ', ' : ''}(max-width: ${
        srcSetProps.width
      }px) ${srcSetProps.width}px`;
    }, '');
    const fullSizeSizesEntry = `${imageProps.width}px`;
    sizes =
      sizes === '' ? fullSizeSizesEntry : `${sizes}, ${fullSizeSizesEntry}`;
    testPoints.every((testPoint: any) => {
      if (testPoint.timeStr === timeStr) {
        testPoint.centralCropSrc = `central-crop/${imageProps.fullSizeFilename}`;
        testPoint.centralCropWidth = imageProps.width;
        testPoint.centralCropHeight = imageProps.height;
        testPoint.centralCropImgBase64 = imageProps.imgBase64;
        testPoint.centralCropSizes = sizes;

        return false;
      }

      return true;
    });
  });

  testPoints.sort((a: any, b: any) => {
    return a.time - b.time;
  });

  return (
    <PhotoFlipper className={props.className}>
      <PhotoStack>
        {testPoints.map((testPoint: any, idx: number) => {
          return (
            <Card
              id={'photo-flipper-card-' + idx}
              key={'photo-flipper-card-' + idx}
              className="photo-flipper-hidden"
            >
              <FullSizeImage
                loader={imageLoader}
                sizes={testPoint.fullSizeSizes}
                src={testPoint.fullSizeSrc}
                alt={`full size image for ${testPoint.timeStr}`}
                width={testPoint.fullSizeWidth}
                height={testPoint.fullSizeHeight}
                placeholder="blur"
                blurDataURL={testPoint.fullSizeImgBase64}
              />
              <CentralCropImage
                loader={imageLoader}
                sizes={testPoint.centralCropSizes}
                src={testPoint.centralCropSrc}
                alt={`central crop image for ${testPoint.timeStr}`}
                width={testPoint.centralCropWidth}
                height={testPoint.centralCropHeight}
                placeholder="blur"
                blurDataURL={testPoint.centralCropImgBase64}
              />
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
