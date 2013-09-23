function init() {
  input_draw();
  var ROOT="https://moodlogr.appspot.com/_ah/api";
  var cid="467877166527.apps.googleusercontent.com";
  var scope="https://www.googleapis.com/auth/userinfo.email";
  gapi.client.load("moodlog","v2",function() {
    /* gapi.auth.authorize({client_id: cid,
      scope: scope,
      immediate: true,
      response_type: "token id_token"},
      authed); */

    d3.select("#login").on("click", function() {
      gapi.auth.authorize({client_id: cid,
        scope: scope,
        immediate: false,
        response_type: "token id_token"},
        authed);
      })
    d3.select("#login").attr("style","opacity: 1")
    }, ROOT)
  }


function authed() {
    show_input();
  };

function show_input() {
  d3.selectAll("div.content > div").attr("style","display: none")
  d3.selectAll("#input").attr("style","display: block")
  }
function carousel(i, wait) {
  cs=d3.selectAll(".carousel").attr("style","opacity: 0.2")
  cs[0][i].style.opacity=1;
  i++;
  if (i==cs[0].length) {
    i=0 }
  window.setTimeout(function(){carousel(i,wait)},wait)
  }
