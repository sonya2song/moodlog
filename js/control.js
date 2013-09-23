var visualize;
function init() {
  input_draw();
  visualize=vis_draw();
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
  if (gapi.auth.getToken()) {
    show_input();
    d3.select("ul.menu").attr("style","display: block");
    }
  };

function show_input() {
  d3.selectAll("div.content > div").attr("style","display: none")
  d3.selectAll("#input").attr("style","display: block")
  d3.selectAll(".menu > li").attr("class","")
  d3.select("#menu-input").attr("class","selected")
  }

function show_vis() {
  d3.selectAll("div.content > div").attr("style","display: none")
  d3.selectAll("#vis").attr("style","display: block")
  d3.selectAll(".menu > li").attr("class","")
  d3.select("#menu-view").attr("class","selected")
  gapi.client.moodlog.entries.list().execute(function(d) {
    visualize(d.items) })
  }

function logout() {
  d3.selectAll("div.content > div").attr("style","display: none");
  d3.selectAll("#start").attr("style","display: block");
  d3.select("ul.menu").attr("style","display: none");
  gapi.auth.setToken(null);
  d3.selectAll("svg").remove();
  input_draw();
  visualize=vis_draw();
  };

function carousel(i, wait) {
  cs=d3.selectAll(".carousel").attr("style","opacity: 0.2")
  cs[0][i].style.opacity=1;
  i++;
  if (i==cs[0].length) {
    i=0 }
  window.setTimeout(function(){carousel(i,wait)},wait)
  }
