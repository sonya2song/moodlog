function vis_draw() {
  var width=1400;
  var height=375;
  var distance=50;
  var leftdistance=75;
  var bottomdistance=75;
  var background="#F9F4D2";

  var month_names=["January","February","March","April","May",
    "June","July","August","September","October","November",
    "December"];

  var svg=d3.select("#vis-graph")
    .append("svg")
    .attr("width",width)
    .attr("height",height);
  
  
  var color=function(n) {
	var cs=["#FF5600",
	    "#58026D",
	    "#049B15",
	    "#FFCA00",
            "#000000",
            "#35C0CD",
            "#F40B9B",
            "#028C7B",
            "#FF0D00",
            "#E51743",
            "#2F00D8",
	    "#80E800"]
	    return cs[n];
		};

  var yscale=d3.scale.linear()
    .domain([1,10])
    .range([distance,height-bottomdistance]);

  var xscale=d3.scale.linear()
    .domain([0,30*24*60])
    .range([leftdistance,width-distance])

  var hexagon=d3.svg.line()
    .x(function(d) { return d.x})
    .y(function(d) { return d.y})
    .interpolate("linear")(
      _.map([1,2,3,4,5,6,1],function(d){ return({x:
      Math.sin(Math.PI/3*d)*5, y: Math.cos(Math.PI/3*d)*5})}))
  
  var month_hexagon=d3.svg.line()
    .x(function(d) { return d.x})
    .y(function(d) { return d.y})
    .interpolate("linear")(
      _.map([1,2,3,4,5,6,1],function(d){ return({x:
      Math.sin(Math.PI/3*d)*15, y: Math.cos(Math.PI/3*d)*15})}))


  var highlight = function(month,force) {
    if (d3.select("#sel-"+month).attr('class')=="selector selected" &! force) {
      d3.select("#sel-"+month).attr('class',"selector");
      d3.select("#group-"+month).attr('class','month');
      d3.select("#sel-"+month+" path").attr("style",
        "fill: "+background+"; stroke: "+color(month))
      }
    else {
      d3.select("#sel-"+month).attr('class',"selector selected");
      d3.select("#group-"+month).attr('class','month selected');
      d3.select("#sel-"+month+" path").attr("style","fill: "+color(month)+
      "; stroke: "+color(month))
      }
    }
 
  var line=d3.svg.line()
    .x(function(d) { return d.x })
    .y(function(d) { return d.y });
  
  var ygrid=svg.selectAll("line.ygrid")
    .data(_.range(1,11))
    .enter()
    .append("line")
    .attr("class","ygrid")
    .attr("class","grid")
    .attr("x1",50)
    .attr("x2",width-20)
    .attr("y1",function(d) {return yscale(d)})
    .attr("y2",function(d) {return yscale(d)})
  
  var xgrid=svg.selectAll("line.xgrid")
    .data(_.range(0,31))
    .enter()
    .append("line")
    .attr("class","xgrid")
    .attr("class","grid")
    .attr("x1",function(d) {return xscale(d*24*60)})
    .attr("x2",function(d) {return xscale(d*24*60)})
    .attr("y1",20)
    .attr("y2",height-45)

  var xlabel=svg.selectAll("text.xlabel")
    .data(_.range(0,31))
    .enter()
    .append("text")
    .attr("x",function(d) { return xscale(d*24*60) })
    .attr("y",height-48)
    .attr("dx",1)
    .attr("class","xlabel")
    .text(function(d) { return d+1})
  
  var ylabel=svg.selectAll("text.ylabel")
    .data([1,10])
    .enter()
    .append("text")
    .attr("x",50)
    .attr("y",function(d) {return yscale(d) })
    .attr("class","ylabel")
    .attr("text-anchor","end")
    .attr("dy",function(d) { if (d<5) {return -7}
                             else {
                              return 14
                              }})
    .text(function(d) { if (d==1) { return "happy" }
      else { return "sad" }})

  var msel=svg.selectAll("g.selector")
    .data([0,1,2,3,4,5,6,7,8,9,10,11])
    .enter()
    .append("g")
    .attr("class","selector")
    .attr("id",function(d) { return ("sel-"+d) })
    .attr("transform",function(d) {
      return "translate("+[90+d*110,height-20]+")"})
    .on("click",function(d) {highlight(d)})

   msel.append("path")
    .attr("d",month_hexagon)
    .attr("style",function(d) { return "fill: "+background+"; stroke: "+color(d)})
    .text(function(d) {return month_names[d]})
  
   msel.append("text")
    .attr("x",15)
    .attr("y",7)
    .text(function(d) {return month_names[d] })

  return function(data) {    
    //data
    data=_.sortBy(data,function(d) {  
    return d.time})
    data=_.map(data,function(d) {
      d["y"]=yscale(d.score);
      var dt=new Date(d.time);
      var t=(dt.getDate()-1)*24*60+
        dt.getHours()*60+
        dt.getMinutes();
      d["month"]=dt.getMonth();  
      d["x"]=xscale(t);
      d["color"]=color(d.month);
      return d;
      })

  data=_.values(_.reduce(data,function(x,y) {
    var month=y.month
    if (x[month]!=undefined) {
      x[month].push(y);
      }
    else {
      x[month]=[y];
      }
    return x  
    },{}))


  var months=svg.selectAll("g.month")
    .data(data)
    .enter()
    .append("g")
    .attr("class","month")
    .attr("id",function(d) {return "group-"+d[0].month })

  months.append("path")
    .attr("d",function(d) { return line(d) })
    .attr("style",function(d) { return "stroke: "+d[0].color})
    .on("click",function(d) {highlight(d[0].month)});
  
  months.selectAll("path.point")
    .data(function(d) { return d } )
    .enter()
    .append("path")
    .attr("class","point")
    .attr("d",hexagon)
    .attr("transform",function(d) { return "translate("+[d.x,d.y]+")" })
    .attr("style", function(d) { return "fill: "+d.color })
    .on("click",function(d) {
      d3.selectAll(".popup").remove()
      svg.append("switch")
        .attr("class","popup")
        .append("foreignObject")
        .attr("x",d.x)
        .attr("y",d.y)
        .attr("rx",10)
        .attr("ry",10)
        .attr("width",200)
        .attr("height",150)
        .append("xhtml:body")
        .html("<div class='popup'>"+ d.note +"</div>")

      d3.selectAll("div.popup").on("click",function(d) {
        d3.selectAll(".popup").remove()
        })
      })
  

  
  
  highlight(new Date().getMonth(),true);
}}



//d3.json("/api/1/entries",draw)
