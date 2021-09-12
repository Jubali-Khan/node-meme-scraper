const request = require('request');
const https = require('https');
const cheerio = require('cheerio');
// const download = require('image-downloader');
const fs = require('node:fs');
const path = require('node:path');

// function between(min, max) {
//   return Math.floor(Math.random() * (max - min) + min);
// }

// const directory = 'memes';

// fs.readdir(directory, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(directory, file), (error) => {
//       if (error) throw err;
//     });
//   }
// });

request(
  'https://memegen-link-examples-upleveled.netlify.app/',
  (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const imgUrls = [];
      const doc = cheerio.load(html);

      for (let i = 0; i < 10; i++) {
        imgUrls.push(doc('a > img', html)[i].attribs.src);
      }
      console.log(imgUrls);

      for (let index = 0; index < 10; index++) {
        const url = imgUrls[index];

        https.get(url, function (res) {
          const count = index + '.jpg';
          const fileStream = fs.createWriteStream(count);
          res.pipe(fileStream);

          fileStream.on('error', function (err) {
            console.log(err);
          });

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
            // console.log('Done!');
          });
        });
      }
    }
  },
);
