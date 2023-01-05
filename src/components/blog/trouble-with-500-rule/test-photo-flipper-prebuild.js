const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const { default: full } = require('@babel/core/lib/config/full');

async function createImageSet(file, subDir) {
  // Create the path the browser will need
  const pathsBrowser = [
    '/images/component/test-photo-flipper',
    subDir,
    path.basename(file),
  ];
  const browserFilePath = path.posix.join(...pathsBrowser);

  // Open image with sharp
  const image = sharp(file);

  // Get the image width and height
  const metadata = await image.metadata();

  // Create base64 image placeholder
  const placeholderImgWidth = 20;
  const imgAspectRatio = metadata.width / metadata.height;
  const placeholderImgHeight = Math.round(placeholderImgWidth / imgAspectRatio);
  const imgBase64 = await image
    .resize(placeholderImgWidth, placeholderImgHeight)
    .toBuffer()
    .then(
      (buffer) =>
        `data:image/${metadata.format};base64,${buffer.toString('base64')}`,
    );

  // Create the path to copy the image to
  const pathsDest = [process.cwd(), 'public', browserFilePath];
  const destFilePath = path.posix.join(...pathsDest);

  // Copy the file
  try {
    fs.ensureDir(path.dirname(destFilePath));
    fs.copy(file, destFilePath);
  } catch (err) {
    console.error(`error copying image from ${file} to ${destFilePath}`, err);
  }

  return {
    src: browserFilePath,
    width: metadata.width,
    height: metadata.height,
    imgBase64,
  };
}

exports.getPreBuildProps = async () => {
  try {
    //
    // full-size images
    //
    const fullSizeMetadata = [];

    // Create path to full-size images
    const fullSizePath = path.join(__dirname, 'test-exposures', 'full-size');

    // Get the list of files there
    const fullSizeFiles = fs.readdirSync(fullSizePath);

    // Iterate files
    for (let idx = 0; idx < fullSizeFiles.length; idx++) {
      // Copy image to public directory
      // and collect metadata
      const metadata = await createImageSet(
        path.join(fullSizePath, fullSizeFiles[idx]),
        'full-size',
      );
      fullSizeMetadata.push(metadata);
    }

    //
    // central-crop images
    //
    const centralCropMetadata = [];

    // Create path to central-crop images
    const centralCropPath = path.join(
      __dirname,
      'test-exposures',
      'central-crop',
    );

    // Get the list of files there
    const centralCropFiles = fs.readdirSync(fullSizePath);

    // Iterate files
    for (let idx = 0; idx < centralCropFiles.length; idx++) {
      // Copy image to public directory
      // and collect metadata
      const metadata = await createImageSet(
        path.join(centralCropPath, centralCropFiles[idx]),
        'central-crop',
      );
      centralCropMetadata.push(metadata);
    }

    // Return the data
    return {
      outputFilename: 'test-photo-flipper-props.json',
      props: {
        fullSize: fullSizeMetadata,
        centralCrop: centralCropMetadata,
      },
    };
  } catch (err) {
    console.log(`test-photo-flipper-prebuild.js failed: ${err}`);
  }
};
