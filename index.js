const request = require('request');
const https = require('https');
const cheerio = require('cheerio');
const fs = require('node:fs');

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

      // Where the src attribute values are collected and 'pushed' to imgUrls array:
      for (let i = 0; i < 10; i++) {
        imgUrls.push(doc('a > img', html)[i].attribs.src);
      }
      console.log(imgUrls);

      // Download section:
      /* Using another for loop, we go through the imgUrls array value by value */
      for (let index = 0; index < 10; index++) {
        const url = imgUrls[index];

        https.get(url, function (res) {
          const count = index + '.jpg';
          /* using the https module, the files 'stream' is collected and stored in fileStream, which is passed to the pipe function to store the data */
          const fileStream = fs.createWriteStream(count);
          res.pipe(fileStream);

          // To handle any error:
          fileStream.on('error', function (err) {
            console.log(err);
          });

          // Upon finishing the download, the file is moved to the memes folder using fs.rename() and the stream is closed
          fileStream.on('finish', function () {
            fs.rename(
              __dirname + '/' + count,
              __dirname + '/memes/' + count,
              (err) => {
                if (err) throw err;
                else console.log('Successfully downloaded a file from ' + url);
              },
            );
            fileStream.close();
          });
        });
      }
    }
  },
);
