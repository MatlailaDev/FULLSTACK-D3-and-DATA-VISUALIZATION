async function drawScatterplot() {
    // 1.Acess Data
    const dataset = await d3.json("/data/my_weather_data.json")
    console.table(dataset)

    const xAccessor = (d) => d.dewPoint
    const yAccessor = (d) => d.humidity
    const colorAccessor = (d) => d.cloudCover

    // 2.Create Dimensions
    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

    const svgWidth = width
    const svgHeight = width
    const marginLeft = 50
    const marginRight = 10 
    const marginTop = 10
    const marginBottom = 50
    
    const boundsWidth = svgWidth - marginLeft - marginRight
    const boundsHeight = svgHeight - marginTop - marginBottom

    // 3. Draw Canvas
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("viewBox", `0,0 ${svgWidth} ${svgHeight}`)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${marginLeft}px, ${marginTop}px)`)

    bounds.append("defs")
            .append("clipPath")
            .attr("id", "bounds-clip-path")
        .append("rect")
            .attr("width", boundsWidth)
            .attr("height", boundsHeight)

    const clip = bounds.append("g")
        .attr("clip-path", "url(#bounds-clip-path)")

    // 4.Create Scales
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

    
    const drawDots = (dataset, color) => {
        // 5.Draw Data
        const dots = clip.selectAll("circle")
            .data(dataset, (d) => d[0])

        const newDots = dots.enter()
            .append("circle")

        const allDots = newDots.merge(dots)
            .attr("cx", (d) => xScale(xAccessor(d)))
            .attr("cy", (d) => yScale(yAccessor(d)))
            .attr("r", 4)
            .attr("fill", color)

        const oldDots = dots.exit()
            .remove()
    }

    drawDots(dataset, (d) => colorScale(colorAccessor(d)))

    const xAxis = bounds.append("g")
        .call(d3.axisBottom(xScale))
        .style("transform", `translateY(${boundsHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", boundsWidth/2)
        .attr("y", marginBottom - 5)
        .attr("fill", "black")
        .style("font-size", "1.2em")
        .text("Dew Point")

    const yAxis = bounds.append("g")
        .call(d3.axisLeft(yScale).ticks(4))

    const yAxisLabel = yAxis.append("text")
        .attr("x", -boundsHeight/2)
        .attr("y", -marginLeft + 10)
        .attr("fill", "black")
        .style("font-size", "1.2em")
        .style("transform", `rotate(-90deg)`)
        .style("text-anchor", "middle")
        .text("Relative Humidity")
}

drawScatterplot()