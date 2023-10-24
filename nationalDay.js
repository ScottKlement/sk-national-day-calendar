const express = require('express')
const path = require('path');
const needle = require('needle');
const fs = require('fs');
const homedir = require('os').homedir();
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
var bodyParser = require('body-parser');

sharp.cache(false);

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', asyncHandler(async (req, res) => {

  var outputDir = homedir + path.sep + "Pictures" + path.sep + "Backgrounds";
  var date = new Date();
  date.setDate(date.getDate() + 1);
  var fmtDate = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
  outputDir += path.sep + fmtDate;

  res.render("index", {
    hidepath: outputDir,
    inputlist: "",
    resultpath: outputDir
  });

}));

app.post('/', asyncHandler(async (req, res) => {

  var inputlist = req.body.inputlist;
  var resultpath = req.body.resultpath;
  var outputDir = resultpath;

  if (typeof req.body.quit === "string" && req.body.quit === "Quit") {
    res.end("<h1>No work done, Quit Pressed.</h1>");
    return;
  }

  try {
    await fs.promises.access(outputDir, fs.constants.F_OK);
  }
  catch (err) {
    await fs.promises.mkdir(outputDir);
  }
 
  var urls = String(inputlist);
  urls = urls.replace(/\r/g, '').split("\n");
  var count = 0;

  if (urls!=null && Array.isArray(urls) && urls.length > 0) {

    for (var i=0; i<urls.length; i++) {

      var url = urls[i];
      if (typeof url === 'string') {
        url = url.trim();
        if (url === "") continue;
      }

      var realFile = outputDir + path.sep + fileName(url);
      var tempFile = __dirname + path.sep + `temp${i}.png`;

      await http_get(url, tempFile);
      await resizeImage(tempFile, realFile);
      await fs.promises.unlink(tempFile);

      count ++;

    }
  
  }

  if (count > 0) {
    res.end("<h1>Success!</h1>");
  } else {
    res.end("<h1>No files downloaded!</h1>")
  }

}));

async function http_get(url, result) { 
  
  try {
    var resp = await needle('get', url, { output: result });
  }
  catch (err) {
    resp = null;
    console.error(err);
  }

  return resp;
}

function fileName(url) {

  var out_image = url;
  if (path.sep != '/') out_image.replace('/', path.sep);
  out_image = path.basename(out_image);
  out_image = decodeURIComponent(out_image);

  out_image = out_image.replace(/\.jpg$/, ".png");
  out_image = out_image.replace(/\.jpeg$/, ".png");
  out_image = out_image.replace(/\.webp$/, ".png");
  
  return out_image; 
}

async function resizeImage(inpFile, outFile) {

  try {
    var info = await sharp(inpFile)
                     .resize({ width: 1080, height: 540 })
                     .extract({top: 0, left: 20, width: 960, height: 540})
                     .toFile(outFile);
  }
  catch (e) {
    info = null;
    console.error(e);
  }

  return info;                           
  
}

app.listen(8080);

console.log("nationalDay.js is active.  Connect to http://localhost:8080/");
