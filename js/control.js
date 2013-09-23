function init() {
  var ROOT="https://moodlogr.appspot.com/_ah/api"
  gapi.client.load("moodlog","v2",function() {
    console.log("moodlog loaded")}, ROOT)
  }

function carousel(i, wait) {
  cs=d3.selectAll(".carousel").attr("style","opacity: 0.2")
  cs[0][i].style.opacity=1;
  i++;
  if (i==cs[0].length) {
    i=0 }
  window.setTimeout(function(){carousel(i,wait)},wait)
  }
