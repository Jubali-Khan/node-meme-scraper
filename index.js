const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
const fs = require('fs');
const path = require('path');

/* This section deletes the contents of the directory memes so that each time the index.js is ran on repl.it the memes are retrieved and fetched*/
const directory = 'memes';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err;
    });
  }
});

/* This section retrieves the HTML and parses it to get the links in an array, which a for loop goes through value by value to download the images to /memes */
request(
  'https://memegen-link-examples-upleveled.netlify.app/',
  (error, response, html) => {
    if (!error && response.statusCode === 200) {
      // Where HTML is retrieved:
      /* create an array to store the links: */
      const imgUrls = [];
      /* use library's method to get the HTML */
      const doc = cheerio.load(html);

      // Where the HTML is parsed
      /* Iterate to add (using .push()) to the empty imgUrls array 10 times */
      /* What is iterated is the commnd to access a specific part of the HTML, namely the
      part where an anchor element is followed by an img element */
      for (let i = 0; i < 10; i++) {
        /* What is iterated is the command to access a specific part of the HTML, namely the
      part where an anchor element is followed by an img element */
        /* instances of <a> followed by <img> are accessed by their index and, using attribs.src,
        the string with the image URL is saved (pushed) to imgUrls*/
        imgUrls.push(doc('a > img', html)[i].attribs.src);
      }
      console.log(imgUrls);

      // Download section:
      /* Using another for loop, we go through the imgUrls array and pass the values returned one by one
      to image-downloader library*/
      for (let index = 0; index < 10; index++) {
        /* the object options is declared and initialized with the value of the key 'url' containing the current  value*/
        const options = {
          url: imgUrls[index],
          dest: './memes',
        };

        /* the object options is then passed to the following section which downloads the image*/
        download
          .image(options)
          .then(({ filename }) => {
            console.log('Saved to', filename);
          })
          .catch((err) => console.error(err));
      }
    }
  },
);

// Provide commentary before pushing to github
