// ==UserScript==
// @name        National Day Calendar
// @namespace   ndc
// @match       https://www.nationaldaycalendar.com/what-day-is-it/*
// @match       https://www.nationaldaycalendar.com/tomorrow/*
// @version  1
// @grant    GM.openInTab
// @grant    GM.xmlHttpRequest
// ==/UserScript==

var sck = {};

sck.getList = function () {

//  var list = document.querySelectorAll("picture.is-loaded source[type='image/webp']");
  var list = document.querySelectorAll("a phoenix-picture picture source[type='image/webp']");
//  console.debug("  is-loaded: " + list.length + "   without: " + list2.length);

  if (list.length === 0) {
    alert("No webp images found!");
    return null;
  }

  return list;
}

sck.get = function (gurl, cb) {
  GM.xmlHttpRequest({
    method: "GET",
    url: gurl,
    onload: function (xhr) { cb(xhr); }
  });
}

sck.parseSrcSet = function (sobj) {

  var srcset = sobj.getAttribute("srcset");
  if (!srcset && sobj.dataset) srcset = sobj.dataset.srcset;
  var highres = 0;
  var highurl = "";

  if (srcset) {
    srcset = srcset.split(",");
//    console.debug("srcset", srcset);
    if (Array.isArray(srcset) && srcset.length > 0) {
      for (var i = 0; i < srcset.length; i++) {
        if (typeof srcset[i] == "string") {
          srcset[i] = srcset[i].trim();
          var parts = srcset[i].split(" ");
//          console.debug("  parts", parts);
          if (parts.length == 2) {
            var res = parseInt(parts[1]);
            if (res > highres) {
              highres = res;
              highurl = parts[0];
//              console.debug("    result", highurl);
            }
          }
        }
      }
    }
  }
  else {
    console.debug("no srcset");
    console.debug(sobj);
  }

  return highurl;

}

sck.addDomElements = function () {

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
  textarea.style.width = "1500px";
  textarea.style.display = "none";
  textarea.style.fontFamily = "fixed,monospace";
  textarea.style.fontSize = "11px";
  textarea.style.lineHeight = "12px";

  var button = document.createElement("button");
  button.id = "sckbutton";
  button.style.top = "0px";
  button.style.left = "0px";
  button.innerHTML = "Open List";

  button.onclick = function (event) {
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

  var mainContent = document.getElementById("main-content");
  var parentNode = mainContent.parentNode;

  parentNode.insertBefore(div, mainContent);

}

sck.examinePage = function () {
  
  var count = 0;
  var phpix = document.getElementsByTagName("phoenix-picture");
  for (var pic of phpix) {
    var pnode = pic.parentNode;
    if (pnode.tagName == "A") 
      count ++;
  }
  
//  console.debug("  counted " + count + " pics");

  var list = sck.getList();
//  console.debug("  received " + list.length + " images");
  
  if (count > list.length) {
    setTimeout(function() {
      sck.examinePage();
    }, 2000);
    return;
  }
  
  for (var lunk of list) {
    var url = sck.parseSrcSet(lunk);
    var t = document.getElementById("scktextarea");
    t.appendChild(document.createTextNode(url + "\n"));
  }
}

const TIMEOUT = 2000;
setTimeout(function () {
  sck.addDomElements();
  sck.examinePage();
}, TIMEOUT);
