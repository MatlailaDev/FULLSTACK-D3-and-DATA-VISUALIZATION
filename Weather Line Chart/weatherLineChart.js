async function drawLineChart(){
    const dataset = await d3.json("/data/my_weather_data.json")

    console.table(dataset)

    const yAccessor = function(d){return d.temperatureMin}

    const dateParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = function(d){return dateParser(d.date)}

    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60,
        },
               
    }

    const boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

    const boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const wrapper = d3.select("#wrapper")
                        .append("svg")
                        .attr("width", dimensions.width)
                        .attr("height", dimensions.height)


    const bounds = wrapper.append("g")
                            .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

    const yScale = d3.scaleLinear()
                        .domain(d3.extent(dataset, yAccessor))
                        .range([boundedHeight, 0])

    const xScale = d3.scaleTime()
                        .domain(d3.extent(dataset, xAccessor))
                        .range([0, boundedWidth])

    const freezingTemperaturePlacement = yScale(32)

    const freezingTemperatures = bounds.append("rect")
                                        .attr("x", 0)
                                        .attr("y", freezingTemperaturePlacement)
                                        .attr("width", boundedWidth)
                                        .attr("height", boundedHeight - freezingTemperaturePlacement)
                                        .attr("fill", "#E0F3F3")

    const lineGenerator = d3.line()
                            .x(function(d){return xScale(xAccessor(d))})
                            .y(function(d){return yScale(yAccessor(d))})

    


    const line = bounds.append("path")
                        .attr("d", lineGenerator(dataset))
                        .attr("fill", "none")
                        .attr("stroke", "#AF9358")
                        .attr("stroke-width", 2)

    const xAxis = d3.axisBottom(xScale)

    bounds.append("g")
            .attr("class", "xAxis")
            .style("transform", `translateY(${boundedHeight}px)`)
            .call(xAxis)

    const yAxis =  d3.axisLeft(yScale)

    bounds.append("g")
            .attr("class", "yAxis")
            .call(yAxis)

}

drawLineChart()