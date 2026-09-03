async function drawScatterplot(){

    let dataset = await d3.json("/data/my_weather_data.json")
    console.table(dataset)


    const xAccessor = function(d){return d.dewPoint}

    const yAccessor = function(d){return d.humidity}

    const colorAccessor = function(d){return d.cloudCover}

    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

    const svgWidth = width
    const svgHeight = width
    const marginLeft = 50
    const marginRight = 10
    const margintop = 10
    const marginBottom = 50
    const boundsWidth = svgWidth - marginLeft - marginRight
    const boundsHeight = svgHeight - margintop - marginBottom
    

    const wrapper = d3.select("#wrapper")
                        .append("svg")
                        .attr("width", svgWidth)
                        .attr("height", svgHeight)

    const bounds = wrapper.append("g")
                            .style("transform", `translate(${marginLeft}px, ${margintop}px)`)

    const xScale = d3.scaleLinear()
                        .domain(d3.extent(dataset, xAccessor))
                        .range([0, boundsWidth])
                        .nice()

    const yScale = d3.scaleLinear()
                        .domain(d3.extent(dataset, yAccessor))
                        .range([boundsHeight, 0])
                        .nice()


    const colorScale = d3.scaleLinear()
                            .domain(d3.extent(dataset, colorAccessor))
                            .range(["skyblue", "darkslategrey"])

    
    function drawDots(dataset, color){
        
        let dots = bounds.selectAll("circle")
                        .data(dataset)
                        
        dots.enter()
            .append("circle")
            .attr("cx", function(d){return xScale(xAccessor(d))})
            .attr("cy", function(d){return yScale(yAccessor(d))})
            .attr("r", 5)
            .attr("fill", color)
    }

    // drawDots(dataset, "blue")

    drawDots(dataset.slice(0, 200), "darkgrey")
    
    setTimeout(function(){return drawDots(dataset, "cornflowerblue")}, 1000)

    // drawDots(dataset, "red")
    
    function drawDotsAgain(dataset, color){ 
        let dots = bounds.selectAll("circle")
                            .data(dataset)
        
        dots.enter()
            .append("circle")

        bounds.selectAll("circle")
                .attr("cx", function(d){return xScale(xAccessor(d))})
                .attr("cy", function(d){return yScale(yAccessor(d))})
                .attr("r", 5)
                .attr("fill", color)
    }

    setTimeout(function(){return drawDotsAgain(dataset, "yellow")}, 2500)

    function drawDotsWithMerge(dataset, color){
        let dots = bounds.selectAll("circle").data(dataset)

        dots.enter()
            .append("circle")
            .merge(dots)
            .attr("cx", function(d){return xScale(xAccessor(d))})
            .attr("cy", function(d){return yScale(yAccessor(d))})
            .attr("r", 5)
            .attr("fill", color)

    }

    setTimeout(function(){return drawDotsWithMerge(dataset, "cornflowerblue")}, 5000)

    function drawDotsWithJoin(dataset, color){
        let dots = bounds.selectAll("circle").data(dataset)

        dots.join("circle")
            .attr("cx", function(d){return xScale(xAccessor(d))})
            .attr("cy", function(d){return yScale(yAccessor(d))})
            .attr("r", 5)
            .attr("fill", color)
    }

    setTimeout(function(){return drawDotsWithJoin(dataset, function(d){return colorScale(colorAccessor(d))})}, 10000)

    const xAxis = bounds.append("g")
                        .attr("class", "xAxis")
                        .call(d3.axisBottom(xScale))
                        .style("transform", `translateY(${boundsHeight}px)`)

    const xAxisLabel = xAxis.append("text")
                            .attr("x", boundsWidth/2)
                            .attr("y", marginBottom - 10)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .html("Dew point (&deg;F)")

    const yAxis = bounds.append("g")
                        .attr("class", "yAxis")
                        .call(d3.axisLeft(yScale).ticks(4))

    const yAxisLabel = yAxis.append("text")
                            .attr("x", -boundsHeight/2)
                            .attr("y", -marginLeft + 10)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .text("Relative humidity")
                            .style("transform", "rotate(-90deg)")
                            .style("text-anchor", "middle")

    



    
                        
                        
}

drawScatterplot()