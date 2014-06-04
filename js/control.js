var visualize;
var user={};

function init() {
  input_draw();
  visualize=vis_draw();
  var ROOT="https://moodlogr.appspot.com/_ah/api";
  var cid="746592052323-tal7u251f9ioc9m6b9bo159cuhbq20n5.apps.googleusercontent.com";
  var scope="https://www.googleapis.com/auth/userinfo.email";
  gapi.client.load("moodlog","v2",function() {
    if (! gapi.client.moodlog) {
      // if the client did not load successfully load again!
      init(); }

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
    }, ROOT);
  };


function authed() {
  if (gapi.auth.getToken()) {
    show_input();
    gapi.client.moodlog.entries.list().execute(function(d) {
      user.data=d.items;
      visualize(user.data); })
    d3.select("ul.menu").attr("style","display: block");
    }
  };

function show_input() {
  d3.selectAll("div.content > div").attr("style","display: none")
  d3.selectAll("#input").attr("style","display: block")
  d3.selectAll(".menu > li").attr("class","")
  d3.select("#menu-input").attr("class","selected")
  }

function reset_input() {
  d3.select("#input-graph > svg").remove();
  input_draw();
  document.getElementById("note").value="";
  d3.select("#submitbutton > img").remove();
  d3.select("#submitbutton").append("a")
    .attr("href","#")
    .on("click",sbmt)
    .append("img")
    .attr("src","img/submit.png");
  }

function show_vis() {
  d3.selectAll("div.content > div").attr("style","display: none")
  d3.selectAll("#vis").attr("style","display: block")
  d3.selectAll(".menu > li").attr("class","")
  d3.select("#menu-view").attr("class","selected")
  visualize(user.data);
  };

function logout() {
  d3.selectAll("div.content > div").attr("style","display: none");
  d3.selectAll("#start").attr("style","display: block");
  d3.select("ul.menu").attr("style","display: none");
  gapi.auth.setToken(null);
  user={};
  d3.selectAll("svg").remove();
  input_draw();
  visualize=vis_draw();
  };

function carousel(i, wait) {
  var cs=d3.selectAll(".carousel").attr("class","carousel")
  cs[0][i].className="carousel selected";
  i++;
  if (i==cs[0].length) {
    i=0 }
  window.setTimeout(function(){carousel(i,wait)},wait)
  };

window.onload=function() {
  carousel(0,5000);
  }
