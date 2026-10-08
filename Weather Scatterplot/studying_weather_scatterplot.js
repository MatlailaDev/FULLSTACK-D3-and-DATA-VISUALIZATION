async function drawScatterplot(){
    let dataset = await d3.json("/data/my_weather_data.json")
    console.table(dataset)

    const xAccessor = function(d){return d.dewPoint}
    const yAccessor = function(d){return d.humidity}
    const colorAccessor = function(d){return d.cloudCover}

    const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

    const svgWidth = width
    const svgHeight = width
    const marginLeft  = 50
    const marginRight = 10
    const marginTop = 10
    const marginBottom = 50
    const boundsWidth = svgWidth - marginLeft - marginRight
    const boundsHeight = svgHeight - marginTop - marginBottom

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
                            .range(["purple", "skyblue"])

    const wrapper = d3.select("#wrapper")
                        .append("svg")
                        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
                        .style("width", "100%")
                        .style("height", "auto")
                        .style("display", "block")
                        

    const bounds = wrapper.append("g")
                            .style("transform", `translate(${marginLeft}px, ${marginTop}px)`)

    function drawDotsWithColorScale(dataset, color){
        
        const dots = bounds.selectAll("circle")
                        .data(dataset)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d){return xScale(xAccessor(d))})
                        .attr("cy", function(d){return yScale(yAccessor(d))})
                        .attr("r", 5)
                        .attr("fill", color)
                        .attr("class", "dots")


         
                    
    }
    
    drawDotsWithColorScale(dataset, function(d){return colorScale(colorAccessor(d))})


    const xAxis = bounds.append("g")
                        .attr("class", "xAxis")
                        .call(d3.axisBottom(xScale))
                        .style("transform", `translateY(${boundsHeight}px)`)

    const xAxisLabel = xAxis.append("text")
                            .attr("x", boundsWidth/2)
                            .attr("y", marginBottom - 10)
                            .style("font-size", "1.4em")
                            .attr("fill", "black")
                            .html("Dew point (&deg;F)")

    const yAxis = bounds.append("g")
                        .attr("class", "yAxis")
                        .call(d3.axisLeft(yScale).ticks(4))

    const yAxisLabel = yAxis.append("text")
                            .attr("x", - boundsHeight/2)
                            .attr("y", -marginLeft + 10)
                            .attr("fill", "black")
                            .style("font-size", "1.4em")
                            .html("Relative humidity")
                            .style("transform", "rotate(-90deg)")
                            .style("text-anchor", "middle")


    // 7. Set up interactions
    bounds.selectAll("circle")
           .on("mouseenter", onMouseEnter)
            .on("mouseleave", onMouseLeave) 



    const tooltip = d3.select("#tooltip")

    function onMouseEnter(event, datum, index) {
        tooltip.select("#count")
            .text(yAccessor(datum))

        tooltip.select("#range")
            .text([datum.x0, datum.x1].join(" - "))



        // Convert chart coordinates -> pixels, accounting for the viewBox scaling
        const svgRect = wrapper.node().getBoundingClientRect()
        const wrapperRect = document.getElementById("wrapper").getBoundingClientRect()
        const k = svgRect.width / svgWidth

        const x = (svgRect.left - wrapperRect.left)
                + (xScale(datum.x0) + (xScale(datum.x1) - xScale(datum.x0)) / 2 + marginLeft) * k
        const y = (svgRect.top - wrapperRect.top)
                + (yScale(yAccessor(datum)) + marginTop - 5) * k

        tooltip.style("transform", `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`)
                .style("opacity", 0.9)

    }

    function onMouseLeave() {
        tooltip.style("opacity", 0)
    }


    
}

drawScatterplot()