const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');

const imageWidthBreakpoints = [320, 640, 960, 1280, 1920, 2560, 3840];

async function createImageSet(file, destDir) {
  // Get the base file name
  const basename = path.basename(file);
  const extStartIdx = basename.lastIndexOf('.');
  const baseFileName = basename.substring(0, extStartIdx);
  const imageExt = basename.substring(extStartIdx);

  // Open image with sharp
  const image = sharp(file);

  // Get the image width and height
  const metadata = await image.metadata();

  // Create base64 image placeholder
  const placeholderImgWidth = 20;
  const imgAspectRatio = metadata.width / metadata.height;
  const placeholderImgHeight = Math.round(placeholderImgWidth / imgAspectRatio);
  const imgBase64 = await image
    .resize({ width: placeholderImgWidth })
    .toBuffer()
    .then(
      (buffer) =>
        `data:image/${metadata.format};base64,${buffer.toString('base64')}`,
    );

  // Create the path to copy the full size image to
  const fullSizeDestFilePath = path.posix.join(
    destDir,
    `${baseFileName}${imageExt}`,
  );

  // Copy the full size image
  try {
    fs.ensureDirSync(path.dirname(fullSizeDestFilePath));
    fs.copySync(file, fullSizeDestFilePath);
  } catch (err) {
    console.error(
      `error copying image from ${file} to ${fullSizeDestFilePath}`,
      err,
    );
  }

  // Create smaller images
  let imageSet = [];
  for (let idx = 0; idx < imageWidthBreakpoints.length; idx++) {
    const width = imageWidthBreakpoints[idx];

    // Only create images that are smaller
    // than the full size image
    if (width < metadata.width) {
      // Create the path to write the resized
      // image to
      const destFilePath = path.posix.join(
        destDir,
        `${baseFileName}-${width}${imageExt}`,
      );

      try {
        // Resize image and write out to
        // file
        await image.resize({ width }).toFile(destFilePath);

        // Add metadata about this file
        // to imageSet
        imageSet.push({ filename: path.basename(destFilePath), width });
      } catch (err) {
        console.log(
          `Error resizing ${file} to width ${width} and writing to ${destFilePath}: ${err}`,
        );
      }
    }
  }

  return {
    fullSizeFilename: path.basename(fullSizeDestFilePath),
    width: metadata.width,
    height: metadata.height,
    imgBase64,
    imageSet,
  };
}

module.exports = { createImageSet };
