function draw(data) {
  var width=800;
  var height=600;
  var distance=50;

  var month_names=["January","February","March","April","May",
    "June","July","August","September","October","November",
    "December"];

  var svg=d3.select("#graph")
    .append("svg")
    .attr("width",width)
    .attr("height",height);
  
  console.log(data);
  
  var color=d3.scale.category20();

  yscale=d3.scale.linear()
    .domain([1,10])
    .range([distance,height-distance]);

  xscale=d3.scale.linear()
    .domain([0,30*24*60])
    .range([distance,width-distance])

   
  data=_.map(data,function(d) {
    d["y"]=yscale(d.score);
    dt=new Date(d.time);
    t=(dt.getDate()-1)*24*60+
      dt.getHours()*60+
      dt.getMinutes();
    d["month"]=dt.getMonth();  
    d["x"]=xscale(t);
    d["color"]=color(d.month);
    return d;
    })

  data=_.values(_.reduce(data,function(x,y) {
    month=y.month
    if (x[month]!=undefined) {
      x[month].push(y);
      }
    else {
      x[month]=[y];
      }
    return x  
    },{}))

  highlight = function(month) {
    if (d3.select("#sel-"+month).attr('class')=="selected") {
      d3.select("#sel-"+month).attr('class',"");
      d3.select("#group-"+month).attr('class','month');
      }
    else {
      d3.select("#sel-"+month).attr('class',"selected");
      d3.select("#group-"+month).attr('class','month selected');
      }
    }
 
  line=d3.svg.line()
    .x(function(d) { return d.x })
    .y(function(d) { return d.y });

  months=svg.selectAll("g.month")
    .data(data)
    .enter()
    .append("g")
    .attr("class","month")
    .attr("id",function(d) {return "group-"+d[0].month })
    .on("click",function(d) {highlight(d[0].month)});
  
    months.selectAll("circle")
    .data(function(d) { return d } )
    .enter()
    .append("circle")
    .attr("cy",function(d) { return d.y})
    .attr("cx",function(d) { return d.x})
    .attr("r","5")
    .attr("style", function(d) { return "fill: "+d.color })
    .append("title")
    .text(function(d) { return d.note });
  
  months.append("path")
    .attr("d",function(d) { return line(d) })
    .attr("style",function(d) { return "stroke: "+d[0].color});

  
  d3.select("#control").selectAll("li")
    .data([0,1,2,3,4,5,6,7,8,9,10,11])
    .enter()
    .append("li")
    .attr("id",function(d) { return ("sel-"+d) })
    .attr("style",function(d) { return "background: "+color(d)})
    .text(function(d) {return month_names[d]})
    .on("click",function(d) {highlight(d)})
}