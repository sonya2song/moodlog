function draw() {
  var width=200;
  var height=300;
  var distance=50;

  var svg=d3.select("#graph")
    .append("svg")
    .attr("width",width)
    .attr("height",height);
	
	var xcenter = 100;
	var ycenter = 150;
	var rface = 50;
	var reye = 7;
	var xdisteye = 15;
	var ydisteye = 10;
	var xdistmouth = 20;
	var ydistmouth = 20;
  var arrowlength = 50;
  var xdtip = 10;
  var ydtip = 10;
  
  var deltascale=d3.scale.linear()
        .domain([rface+2,height-rface-2])
        .range([-10,10])

  var delta=function(d) {
  if (d==undefined) {
    return 0;
  }
  else {
    return deltascale(d.y);
    }
  }
	
  var line=d3.svg.line()
		.x(function(d) { return d.x })
		.y(function(d) { return d.y })
		.interpolate("basis-open")

  var mouthline=function(d) {
		return(line([{x:(-xdistmouth),y:ydistmouth+delta(d)},{x:0,y:ydistmouth-delta(d)},{x:xdistmouth,
    y:ydistmouth+delta(d)}]))
     
    }

  var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            d3.select("g.arrow").remove();
            d.y+=d3.event.dy
            if (d.y > height-rface) {
               d.y=height-rface-2;
               }
            if (d.y < rface) {
               d.y=rface+2
               }
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + [ d.x,d.y ] + ")"
            });
            d3.select("#mouth").attr("d",mouthline(d));
        });

	var smiley=svg.append("g")
    .data([{"x":xcenter,"y":ycenter}])
    .attr("id","smiley")
    .attr("transform",function(d) { return("translate("+[d.x,d.y]+")")})
    .call(drag)

  smiley.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", rface)
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#FFCA00")

	smiley.selectAll("circle.eye")
		.data([-1,1])
		.enter()
		.append("circle")
		.attr("class","eye")
		.attr("cx", function(d) { return (xdisteye*d)})
		.attr("cy", - ydisteye)
		.attr("r", reye)
		.attr("style", "stroke:#000; stroke-width:1.5px; fill:#000");
	
	var line=d3.svg.line()
		.x(function(d) { return d.x })
		.y(function(d) { return d.y })
		.interpolate("basis")
		
	var mouth=smiley.append("path")
    .attr("id","mouth")
		.attr("d",mouthline)
		.attr("style", "stroke:#000; stroke-width:2px;");

  
  var arrow=svg.selectAll("g.arrow")
    .data([0,1])
    .enter()
    .append("g")
    .attr("class","arrow")
    .attr("transform",function(d) { if (d) { of=1 } else {of=-1} ;return "translate("+
          [xcenter,ycenter-(rface+5) * of]+") rotate("+180*d+")" })
          
  arrow.append("line")
    .attr("x1",0)
    .attr("x2",0)
    .attr("y1",0)
    .attr("y2",arrowlength)
 
  arrow.selectAll("line.tip")
    .data([1,-1])
    .enter()
    .append("line")
    .attr("class","tip")
    .attr("x1",0)
    .attr("x2",function(d) { return xdtip*d })
    .attr("y1",arrowlength)
    .attr("y2",arrowlength-ydtip)

}




function sbmt() {
  smilescale=d3.scale.linear()
    .domain([50,250])
    .range([1,10])

  note=document.getElementById("note").value;
  d3.select("svg > g#smiley").each(function(d) {
    score=smilescale(d.y);
    xh=new XMLHttpRequest();
    xh.open("POST","/api/1/entries",true);
    xh.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xh.send("note="+note+"&score="+score)
    xh.onreadystatechange=function() {
      console.log(xh.readyState)
      if (xh.readyState==4 && xh.status==200){ 
          response=JSON.parse(xh.responseText);
          if (response.status=="success") {
            window.location.href="/view"; }
          else {
            window.location.href="/";
            }
          }
    }
    d3.select("#submitbutton a").remove()
    d3.select("#submitbutton").append("img")
      .attr("src","img/submit.png")
      .attr("style","opacity: 0.2");
    
    })
  }
