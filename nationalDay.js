const path = require('path');
const needle = require('needle');
const fs = pjs.fiber.wrap(require('fs'));
const Fiber = require('profoundjs-fibers');
const homedir = require('os').homedir();
const sharp = require('sharp');
sharp.cache(false);

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
  out_image = decodeURIComponent(out_image);

  return path.sep + out_image; 
}

function resizeImage(inpFile, outFile) {

  var info = pjs.fiber.runPromise(sharp(inpFile)
                                    .resize({ width: 1080, height: 540 })
                                    .extract({top: 0, left: 60, width: 960, height: 540})
                                    .toFile(outFile));
  return info;                           
  
}

function nationalDay() {
  pjs.defineDisplay("display", "nationalDay.json");

  var outputDir = homedir + path.sep + "Pictures" + path.sep + "Backgrounds";
  var date = new Date();
  date.setDate(date.getDate() + 1);
  var fmtDate = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
  outputDir += path.sep + fmtDate;

  resultpath = outputDir;
  hidepath = outputDir;

  display.screen1.execute();

  if (!quit) {
    outputDir = resultpath;
    if (!fs.existsSync(outputDir)) fs.fiber.mkdir(outputDir);

    var urls = String(inputlist);
    urls = urls.replace(/\r/g, '').split("\n");

    for (var i=0; i<urls.length; i++) {
      var url = urls[i];
      var realFile = outputDir + path.sep + fileName(url);
      var tempFile = __dirname + path.sep + `temp${i}.png`;
      http_get(url, tempFile);
      resizeImage(tempFile, realFile);
      fs.unlinkSync(tempFile);
    }

  }

}

exports.run = nationalDay;
