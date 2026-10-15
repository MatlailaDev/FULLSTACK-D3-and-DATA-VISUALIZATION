async function lineChart() {

    // Access data
    let dataset = await d3.json("/data/my_weather_data.json")
    console.table(dataset)

    const dateParser = d3.timeParse("%Y-%m-%d")
    const xAccessor = (d) => dateParser(d.date)

    dataset = dataset.sort((a,b) => xAccessor(a) - xAccessor(b)).slice(0,100)
    console.log(dataset)

    const yAccessor = (d) => d.temperatureMax

    // 2.Create Dimensions
    const width = window.innerWidth * 0.9
    
    const svgWidth = width
    const svgHeight = 400
    const marginLeft = 60
    const marginRight = 15
    const marginTop = 15
    const marginBottom = 40

    const boundsWidth = svgWidth - marginLeft - marginRight
    const boundsHeight = svgHeight - marginTop - marginBottom

    // 3.Draw canvas
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)

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


    // 4. Create Scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, boundsWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([boundsHeight, 0])

    const freezingTemperaturePlacement = yScale(32)

    const freezingTempRect = clip.append("rect")
        .attr("class", "freezing")
        .attr("x", 0)
        .attr("y", freezingTemperaturePlacement)
        .attr("width", d3.max([0, boundsWidth]))
        .attr("height", d3.max([0, boundsHeight -freezingTemperaturePlacement]))

        
    // 5.Draw Data
    const lineGenerator = d3.line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))

    const line = clip.append("path")
        .attr("class", "line")
        .attr("d", lineGenerator(dataset))

    // 6. Draw Peripherals
    const xAxis = bounds.append("g")
        .call(d3.axisBottom(xScale))
        .style("transform", `translateY(${boundsHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", boundsWidth/2)
        .attr("y", marginBottom - 5)
        .attr("class", "axis-label xAxis-label")
        .text("Date")

    const yAxis = bounds.append("g")
        .call(d3.axisLeft(yScale).ticks(5))

    const yAxisLabel = yAxis.append("text")
        .attr("x", -boundsHeight/2)
        .attr("y", -marginLeft + 20)
        .attr("class", "axis-label yAxis-label")
        .text("Temperature Max (&deg;F)")

    
    const listeningRect = bounds.append("rect")
        .attr("class", "listening-rect")
        .attr("width", boundsWidth)
        .attr("height", boundsHeight)
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave)

    // 7.Set Up Interactions
    const tooltip = d3.select("#tooltip")

    const tooltipCircle = clip.append("circle")
        .attr("r", 4)
        .attr("class", "tooltipCircle")

    function onMouseMove(event) {
        const mousePosition = d3.pointer(event, this)
        const hoveredDate = xScale.invert(mousePosition[0])

        const getDistanceFromHoveredDate = (d) => Math.abs(xAccessor(d)- hoveredDate)

        const closestIndex = d3.leastIndex(dataset, (a,b) => (getDistanceFromHoveredDate(a)) - getDistanceFromHoveredDate(b))

        const closestDataPoint = dataset[closestIndex]

        closestXValue = xAccessor(closestDataPoint)
        closestYValue = yAccessor(closestDataPoint)

        const formatDate = d3.timeFormat("%B %A %-d, %Y")

        tooltip.select("#date")
            .text(formatDate(closestXValue))
        
        const formatTemperature = (d) => `${d3.format(".1f")(d)}F`

        tooltip.select("#temperature")
            .text(formatTemperature(closestYValue))

        const x = xScale(closestXValue)
        const y = yScale(closestYValue)

        tooltip.style("transform", `translate(`
             + `calc(-50% + ${x}px),`
             + `calc(-100% + ${y}px)`   
             + `)`)

        tooltipCircle.attr("cx", xScale(closestXValue))
                        .attr("cy", yScale(closestYValue))
                        .style("opacity", 1)

        tooltip.style("opacity", 1)
    }

    function onMouseLeave() {
        tooltip.style("opacity", 0)

        tooltipCircle.style("opacity", 0)
    }

}

lineChart()