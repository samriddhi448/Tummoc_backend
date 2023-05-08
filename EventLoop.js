const fs = require('fs');
const path = require('path');

const directoryPath = '/path/to/directory';

// Read files from directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Process each file
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // Read file contents
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      // Process file contents
      // Perform desired operations on 'data' here

      console.log(`File ${file} processed.`);
    });
  });
});

console.log('File processing initiated.');

// Other code and tasks can continue executing here
