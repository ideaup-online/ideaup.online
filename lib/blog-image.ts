import path from 'path';

export type ImageMetadata = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  imgBase64: string;
};

export async function createImageSet(
  id: string,
  category: string,
  imageProps: { url: string; alt?: string; title?: string },
): Promise<ImageMetadata> {
  // Create the path the browser will need
  const pathsBrowser = ['/images/blog', category, id, imageProps.url];
  const browserFilePath = path.posix.join(...pathsBrowser);

  // Create the path to the source image file
  const pathsSource = [process.cwd(), 'content/blog', id, imageProps.url];
  const sourceFilePath = path.posix.join(...pathsSource);

  // Open image with sharp
  const sharp = require('sharp');
  const image = sharp(sourceFilePath);

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
      (buffer: any) =>
        `data:image/${metadata.format};base64,${buffer.toString('base64')}`,
    );

  // Create the path to copy the image to
  const pathsDest = [process.cwd(), 'public', browserFilePath];
  const destFilePath = path.posix.join(...pathsDest);

  // Copy the file
  const fs = require('fs-extra');
  try {
    fs.ensureDir(path.dirname(destFilePath));
    fs.copy(sourceFilePath, destFilePath);
  } catch (err) {
    console.error(`error copying file`, err);
  }

  // Get the alt text
  let alt = 'an image';
  if (imageProps.alt) {
    alt = imageProps.alt;
  }

  return {
    src: browserFilePath,
    alt,
    width: metadata.width,
    height: metadata.height,
    title: imageProps.title,
    imgBase64,
  };
}
