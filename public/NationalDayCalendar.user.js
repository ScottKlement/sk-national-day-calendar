// ==UserScript==
// @name        National Day Calendar
// @namespace   ndc
// @match       https://nationaldaycalendar.com/what-day-is-it/*
// @match       https://nationaldaycalendar.com/tomorrow/*
// @version  1
// @grant    GM.openInTab
// @grant    GM.xmlHttpRequest
// ==/UserScript==
var sck = {};

sck.getList = function() {

  var list = document.querySelectorAll(".ndc-text-national-day-today-text-list h3 a");

  if (list.length === 0) {
    list = document.querySelectorAll(".desc_trig_outter a.evcal_list_a");
  }

  if (list.length === 0) {
    list = document.querySelectorAll(".ndc-text-tomorrows-celebrations h3 a");
  }

  if (list.length === 0) {
    alert("No Links Found!");
    return null;
  }

  return list;
}


sck.logList = function(list) {
  if (!list) return;
  for (var i=0; i<list.length; i++) {
    console.info("link" + i + ": " + list[i].href);
  }
}

sck.get = function(gurl, cb) {
  GM.xmlHttpRequest({
    method: "GET",
    url: gurl,
    onload: function(xhr) { cb(xhr); }
  });
}

sck.parseSrcSet = function(image) {
  
  var srcset = image.srcset;
  var highres = 0;
  var highurl = "";
  
  if (srcset) {
    srcset = srcset.split(",");
    console.debug("srcset", srcset);
    if (Array.isArray(srcset) && srcset.length > 0) {
      for (var i=0; i<srcset.length; i++) {
        if (typeof srcset[i] == "string") {
          srcset[i] = srcset[i].trim();
          var parts = srcset[i].split(" ");
          console.debug("  parts", parts);
          if (parts.length == 2) {
            var res = parseInt(parts[1]);
            if (res > highres) {
              highres = res;
              highurl = parts[0];
              console.debug("    result", highurl);
            }
          }
        }
      }
    }
  } 
  
  return (highres > 0) ? highurl : null;
  
}

sck.findImageUrlDom = function(link) { 
  
  sck.get(link.href, function(xhr) {
    var el = document.createElement('div');
    el.innerHTML = xhr.responseText;
    var images = el.getElementsByTagName("img");
    for (var i=0; i<images.length; i++) {
      var image = images[i];
      var src = sck.parseSrcSet(image);
      if (src !== null) {
        var t = document.getElementById("scktextarea");
        t.appendChild(document.createTextNode(image.src + "\n"));
        break;
      }
    }
    delete el;
  });
  
}

var div = document.createElement("div");
div.style.position = "fixed";
div.id = "sckdiv";
div.style.top = "0px";
div.style.left = "0px";
div.style.zIndex = 10001;

var textarea = document.createElement("textarea");
textarea.id = "scktextarea";
textarea.style.top = "55px";
textarea.style.left = "0px";
textarea.style.height = "100px";
textarea.style.width  = "1500px";
textarea.style.display = "none";

var button = document.createElement("button");
button.id = "sckbutton";
button.style.top = "0px";
button.style.left = "0px";
button.innerHTML = "Open List";

button.onclick = function(event) {
  var t = document.getElementById("scktextarea");
  var b = document.getElementById("sckbutton");
  if (t.style.display === "none") {
    t.style.display = "block";
    b.innerHTML = "Close List";
    t.select();
  }
  else {
    t.style.display = "none";
    b.innerHTML = "Open List";
  }
}

div.appendChild(button);
div.appendChild(textarea);

document.body.insertBefore(div, document.body.firstChild);

var list = sck.getList();
sck.logList(list);
list.forEach(sck.findImageUrlDom);
