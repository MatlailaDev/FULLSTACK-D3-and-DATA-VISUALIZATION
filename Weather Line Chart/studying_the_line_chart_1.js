async function drawLineChart(){

    const dataset = await d3.json("/data/my_weather_data.json")

    console.table(dataset)

    const width = window.innerWidth * 0.9
    const height = 400
    const marginLeft = 60
    const marginRight = 15
    const marginTop = 15
    const marginBottom = 40
    const boundsWidth = width - marginLeft - marginRight
    const boundsHeight = height - marginTop - marginBottom

    const dateParser = d3.timeParse("%Y-%m-%d")
    
    const xAccessor = function(d){return dateParser(d.date)}

    const yAccessor = function(d){return d.temperatureMin}


    const xScale = d3.scaleTime()
                        .domain(d3.extent(dataset, xAccessor))
                        .range([0, boundsWidth])

    const yScale = d3.scaleLinear()
                        .domain(d3.extent(dataset, yAccessor))
                        .range([boundsHeight, 0])

    
    

    const wrapper = d3.select("#wrapper")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)

    const bounds = wrapper.append("g")
                            .style("transform", `translate(${marginLeft}px, ${marginTop}px)`)

    const freezingtemperarurePlacement = yScale(32)

    const freezingTemperature = bounds.append("rect")
                                        .attr("x", 0)
                                        .attr("y", freezingtemperarurePlacement)
                                        .attr("width", boundsWidth)
                                        .attr("height", boundsHeight - freezingtemperarurePlacement)
                                        .attr("fill", "#D4F0FC")

    const lineGenerator = d3.line()
                            .x(function(d){return xScale(xAccessor(d))})
                            .y(function(d){return yScale(yAccessor(d))})

    
    const line = bounds.append("path")
                        .attr("d", lineGenerator(dataset))
                        .attr("fill", "none")
                        .attr("stroke", "#000")
                        .attr("stroke-width", 2)

    const xAxis = d3.axisBottom(xScale)

    bounds.append("g")
            .attr("class", "xAxis")
            .style("transform", `translateY(${boundsHeight}px)`)
            .call(xAxis)


    const yAxis = d3.axisLeft(yScale)
                        

    bounds.append("g")
            .attr("class", "yAxis")
            .call(yAxis)
}

drawLineChart()