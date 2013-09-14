function draw() {
  var width=200;
  var height=300;
  var distance=50;

  var svg=d3.select("#graph")
    .append("svg")
    .attr("width",width)
    .attr("height",height);
	
	var xcenter = 100;
	var ycenter = 100;
	var rface = 50;
	var reye = 10;
	var xdisteye = 20;
	var ydisteye = 10;
	var xdistmouth = 20;
	var ydistmouth = 20;
	var delta = 10;

	var smiley=svg.append("circle")
		.attr("cx", xcenter)
		.attr("cy", ycenter)
		.attr("r", rface)
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#FF0")
//		.on("dragover",function(e){
//	    	console.log("X: "+e.pageX+" Y: "+e.pageY);
// 			alert("dragable!");
// 		})

	var smiley=svg.selectAll("circle.eye")
		.data([-1,1])
		.enter()
		.append("circle")
		.attr("class","eye")
		.attr("cx", function(d) { return xcenter - (xdisteye*d)})
		.attr("cy", ycenter - ydisteye)
		.attr("r", reye)
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#000");
	
	var line=d3.svg.line()
		.x(function(d) { return d.x })
		.y(function(d) { return d.y })
		.interpolate("basis")
		
	var mouth=svg
	.append("path")
		.attr("d",line([{x:(xcenter-xdistmouth),y:ycenter+ydistmouth+delta},{x:xcenter,y:ycenter+ydistmouth},{x:xcenter+xdistmouth, y:ycenter+ydistmouth+delta}]))
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#000");

/*
	var smiley=svg.selectAll("circle")
		.data([3])
		.enter()
		.append("circle")
		.attr("cx", xcenter + xdisteye)
		.attr("cy", ycenter - ydisteye)
		.attr("r", reye)
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#F00");
*/

}




function sbmt() {
  score=document.getElementById("score").value;
  note=document.getElementById("note").value;
  xh=new XMLHttpRequest();
  xh.open("POST","/api/1/entries",true);
  xh.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xh.send("note="+note+"&score="+score)
  xh.onreadystatechange=function() {
    console.log(xh.readyState)
    }
  }
