const fs = require('fs-extra');
const path = require('path');

// Do not descend into these directories
const ignoreDirs = ['./node_modules', './public'];

// Recursive function that visits
// all *.js files; calls fileHandler
// with the full path to each
function recurseDirs(startPath, fileHandler) {
  // Get the list of files
  const files = fs.readdirSync(startPath);

  // Are there any files?
  if (files) {
    // Yes, iterate them
    files.forEach((file) => {
      // Create the full path for this file
      const fullPath = `${startPath}/${file}`;

      // If the path is a regular file
      // ending with '.js'...
      if (file.endsWith('.js') && fs.lstatSync(fullPath).isFile()) {
        // ...call the callback
        fileHandler(fullPath);
      }

      // If the path is a directory
      // that doesn't start with a
      // dot or is ignored...
      if (
        !file.startsWith('.') &&
        !ignoreDirs.includes(fullPath) &&
        fs.lstatSync(fullPath).isDirectory()
      ) {
        // ...recursively descend into path
        recurseDirs(fullPath, fileHandler);
      }
    });
  }
}

// Recursively visit all *.js files
recurseDirs('.', (file) => {
  // Catch and ignore errors
  try {
    // Attempt to load the file
    const exp = require(`./${file}`);

    // Does it export a function named
    // 'getPreBuildProps'?
    if ('getPreBuildProps' in exp) {
      try {
        // Yes, call the function
        console.log(`Running getPreBuildProps from ${file}`);
        Promise.resolve(exp.getPreBuildProps()).then(
          ({ outputFilename, props }) => {
            // Write the JSON to the specified output
            // file in the same directory as its .js
            const outputPath = `${path.dirname(file)}/${outputFilename}`;
            fs.writeFile(outputPath, JSON.stringify(props, null, 2), (err) => {
              // Log error if there is one
              if (err) {
                console.log(
                  `Error writing props to '${outputPath} for ${file}': ${err}`,
                );
              }
            });
            console.log(
              `  Wrote JSON properties file to ${outputPath} for ${file}`,
            );
          },
        );
      } catch (err) {
        console.log(
          `Error writing props to '${outputPath} for ${file}': ${err}`,
        );
      }
    }
  } catch (err) {
    // Don't care (most of the time,
    // uncomment the following line
    // for the times when you do)
    // console.log(`Failed to load file ${file}: ${err}`);
  }
});
