const path = require('path');
const fs = require('fs-extra');
// eslint-disable-next-line import/extensions
const imgHelper = require('../../../../lib/create-image-set.js');

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
      const metadata = await imgHelper.createImageSet(
        path.join(fullSizePath, fullSizeFiles[idx]),
        path.join(
          process.cwd(),
          'public',
          'images',
          'component',
          'test-photo-flipper',
          'full-size',
        ),
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
      const metadata = await imgHelper.createImageSet(
        path.join(centralCropPath, centralCropFiles[idx]),
        path.join(
          process.cwd(),
          'public',
          'images',
          'component',
          'test-photo-flipper',
          'central-crop',
        ),
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
