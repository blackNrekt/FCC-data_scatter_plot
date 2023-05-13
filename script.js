let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let drawCanvas = () => {
    svg.attr("width", width)
        .attr("height", height)
}

let generateScales = () => {
    yScale = d3.scaleTime()                                         
                .range([height-padding,padding])
                .domain([d3.min(values, (d) => {
                    return new Date(d['Seconds']*1000)
                }), d3.max(values, (d) => {
                    return new Date(d['Seconds']*1000)
                })])
                
    
    xScale = d3.scaleLinear()                
                .range([padding, (width-padding)])                  
                .domain([d3.min(values, (d) => {
                    return d['Year']-1
                 }),d3.max(values, (d)=> {
                    return d['Year']+1
                 })])
                
}

let drawPoints = () => {
    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style("position", "absolute")
                    .style("visibility", "hidden")


    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('r','5')
        .attr('data-xvalue',(d) => {
            return d['Year']
        })
        .attr('data-yvalue',(d) => {
            return new Date(d['Seconds']*1000)
        })
        .attr('cx',(d) => {
            return xScale(d['Year'])
        })
        .attr('cy', (d)=> {
            return yScale(new Date(d['Seconds']*1000))
        })
        .attr('fill', (d) => {
            if (d['Doping'] !== '') {
                return ('orange')
            } else {
                return ('blue')
            }
        })
        .on('mouseenter', function(event,d) {
            tooltip.transition()
                    .style('visibility','visible')      
                    .style('background-color', 'white')
                    .style('padding', '10px')
                    .style('border-radius', '5px')
                    .style('box-shadow', '0 0 5px grey');       
            if (d['Doping'] !== '') {
                tooltip.html(d['Name']+": "+ d['Nationality']+"<br>" + 
                             "Year: "+d["Year"]+", "+"Time: "+d['Time']+"<br>"+"<br>"+
                             d['Doping']);
            } else {
                tooltip.html(d['Name']+": "+ d['Nationality']+"<br>" + 
                             "Year: "+d["Year"]+", "+"Time: "+d['Time']+"<br>"+"<br>"+
                             "No allegations");
            }
            document.querySelector("#tooltip").setAttribute("data-year",d['Year'])
        })
        .on("mousemove", function(event,d) {
            tooltip.transition()
                   .duration(0)
                   
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseleave", () => {            
            tooltip.style("visibility", "hidden")
        })

}

let generateAxis = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr("transform","translate(0,"+(height-padding) +")")

    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr("transform","translate("+padding+",0)")
    

}

let drawLegend = () =>{
    let legendContainer = svg.append('g')
                              .attr('id', 'legend')                              
                              .attr('transform', 'translate(' + (width - 150) + ',' + (height / 2 - 75) + ')')
    
    let dopinglegend  = legendContainer.append('g')
                                       .attr('class', 'legend-label')

    dopinglegend.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 15)
                .attr('height', 15)                
                .style('fill', 'orange')
                .attr('transform', `translate(${100},${0})`)

    dopinglegend.append('text')
    .attr('x', 15)
    .attr('y', 12)
    .text('Riders with doping allegations');

    let noDopingLegend = legendContainer.append('g')
                                    .attr('class', 'legend-label')
                                    .attr('transform', 'translate(0,20)');

    noDopingLegend.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 15)
                .attr('height', 15)                
                .style('fill', 'blue')
                .attr('transform', `translate(${100},${0})`)

    noDopingLegend.append('text')
                .attr('x', 15)
                .attr('y', 12)
                .text('No doping allegations');

}

fetch(url)
 .then(response => response.json())
 .then(data => {
    values = data    
    console.log(values)
    drawCanvas()
    generateScales()
    generateAxis()        
    drawLegend()
    drawPoints()
}
)    