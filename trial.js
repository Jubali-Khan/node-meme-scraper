const https = require('https');
const fs = require('fs');

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const url =
  'https://api.memegen.link/images/iw/does_testing/in_production.jpg?width=300';

https.get(url, function (res) {
  let namer = between(0, 1000) + '.jpg';
  const fileStream = fs.createWriteStream(namer);
  res.pipe(fileStream);

  fileStream.on('error', function (err) {
    console.log(err);
  });

  fileStream.on('finish', function () {
    fileStream.close();
    console.log('Done!');
  });
});
