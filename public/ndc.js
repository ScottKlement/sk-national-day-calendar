function body_load() {
   var body = document.getElementById("body");
   body.onkeydown = function(e) {
     e = e || window.event;
     if (e.key === "Enter") {
       var form = document.getElementById("form");
       dontPropagate(e);
       form.submit();
     }
   }

   var inputlist = document.getElementById("inputlist");
   inputlist.onkeydown = dontPropagate;
   inputlist.onkeyup = dontPropagate;
   inputlist.onkeypress = dontPropagate;

   var today = document.getElementById("today");
   today.onclick = today_click;

   var tomorrow = document.getElementById("tomorrow");
   tomorrow.onclick = tomorrow_click;

   var install = document.getElementById("install");
   install.onclick = install_click;
}

function today_click() {
  setResultPath(0);
  window.open("https://nationaldaycalendar.com/what-day-is-it/");
}

function tomorrow_click() {
  setResultPath(1);
  window.open("https://nationaldaycalendar.com/tomorrow/");
}

function install_click() {
  location.href = "NationalDayCalendar.user.js";
}

function dontPropagate(e) {
    e = e || window.event;
    e.stopPropagation();
    e.stopImmediatePropagation();
}

function setResultPath(days) {
    var resultPath = document.getElementById("resultpath");
    if (typeof resultPath.value === "string") resultPath.value = resultPath.value.trim();
    var hidePath = document.getElementById("hidepath");
    if (typeof hidePath.value === "string") hidePath.value = hidePath.value.trim();
    if (hidePath.value === resultPath.value) {
      var curDate = new Date();
      var sep = ( resultPath.value.indexOf("\\") > 0 ) ? "\\" : "/";
      var arr = resultPath.value.split(sep);
      if (arr.length > 1) {
        arr[arr.length - 1] = String(curDate.getFullYear()) + "-" + String(curDate.getMonth()+1) + "-" + String(curDate.getDate() + days);
        resultPath.value = arr.join(sep);
        hidePath.value = arr.join(sep);
      }
    }
  }
  