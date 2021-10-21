const sharp = require('sharp');
const path = require('path');
const needle = require('needle');
const fs = pjs.fiber.wrap(require('fs'));
const Fiber = require('profoundjs-fibers');

var outputDir = "C:\\Users\\sklem\\Pictures\\Backgrounds";
var addedDate = false;

function http_get(url, result) { 

  var fiber = Fiber.current;
  
  needle.get(url, { output: result }, function(err, resp, body) {
    if (err) console.error(err);
    fiber.run(resp);
  });
  Fiber.yield();

}

function fileName(url) {

  var out_image = url;
  if (path.sep != '/') out_image.replace('/', path.sep);
  out_image = path.basename(out_image);

  return outputDir + path.sep + out_image; 
}

function resizeImage(inpFile, outFile) {

  var info = pjs.fiber.runPromise( 
                                   sharp(inpFile)
                                     .resize({ width: 1080, height: 540 })
                                     .extract({top: 0, left: 60, width: 960, height: 540})
                                     .toFile(outFile)
                                 );

}

function nationalDay() {
  pjs.defineDisplay("display", "nationalDay.json");

  if (!addedDate) {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var fmtDate = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
    outputDir += path.sep + fmtDate;
    addedDate = true;
  }

  resultpath = outputDir;

  display.screen1.execute();

  if (!quit) {
    outputDir = resultpath;
    if (!fs.existsSync(outputDir)) fs.fiber.mkdir(outputDir);

    var urls = String(inputlist);
    urls = urls.replace(/\r/g, '').split("\n");

    for (var i=0; i<urls.length; i++) {
      var url = urls[i];
      var realFile = fileName(url);
      var tempFile = __dirname + path.sep + `temp${i}.png`;
      http_get(url, tempFile);
      resizeImage(tempFile, realFile);
      fs.unlinkSync(tempFile);
    }

  }

}

exports.run = nationalDay;