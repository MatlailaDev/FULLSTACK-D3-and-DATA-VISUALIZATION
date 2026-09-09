async function histogram(){

    const dataset = await d3.json("/data/my_weather_data.json")

    const metrics = [
        "humidity",
        "temperatureMax",
        "temperatureMin",
        "moonPhase",
        "windSpeed",
        "dewPoint"
    ]
    
    const width = 600
    const height = width * 0.6
    const marginLeft = 50
    const marginRight = 10
    const marginTop = 30
    const marginBottom = 50

    const boundsWidth = width - marginLeft - marginRight
    const boundsHeight = height - marginBottom - marginTop

    const drawHistogram = (metric) => {

        const metricAccessor = (d) => d[metric]
        const yAccessor = (d) => d.length

        const xScale = d3.scaleLinear()
                            .domain(d3.extent(dataset, metricAccessor))
                            .range([0, boundsWidth])
                            .nice()

        const wrapper = d3.select("#wrapper")
                            .append("svg")
                            .attr("width", width)
                            .attr("height", height)

        const bounds = wrapper.append("g")
                                .style("transform", `translate(${marginLeft}px, ${marginTop}px)`)

        const binGenerator = d3.histogram()
                                .domain(xScale.domain())
                                .value(metricAccessor)
                                .thresholds(12)

        const bins = binGenerator(dataset)

        const yScale = d3.scaleLinear()
                            .domain([0, d3.max(bins, yAccessor)])
                            .range([boundsHeight, 0])
                            .nice()

        const binsGroup = bounds.append("g")

        const binGroups = binsGroup.selectAll("g")
                                    .data(bins)
                                    .enter()
                                    .append("g")

        const barPadding = 1

        const barRects = binGroups.append("rect")
                                    .attr("x", (d) => xScale(d.x0) + barPadding/2)
                                    .attr("y", (d) => yScale(yAccessor(d)))
                                    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
                                    .attr("height", (d) => boundsHeight - yScale(yAccessor(d)))
                                    .attr("fill", "darkslategrey")

        const barText = binGroups.filter(yAccessor)
                                    .append("text")
                                    .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0))/2)
                                    .attr("y", d => yScale(yAccessor(d)) - 5)
                                    .text(yAccessor)
                                    .style("text-anchor", "middle")
                                    .attr("fill", "darkgrey")
                                    .style("font-size", "12px")
                                    .style("font-family", "sans-serif")

        const xAxis = bounds.append("g")
                            .attr("class", "xAxis")
                            .call(d3.axisBottom(xScale))
                            .style("transform", `translateY(${boundsHeight}px)`)

        const xAxisLabel = xAxis.append("text")
                                .attr("x", boundsWidth/2)
                                .attr("y", marginBottom - 10)
                                .attr("fill", "black")
                                .attr("font-size", "1.4em")
                                .text(metric)
        
    }

    metrics.forEach(drawHistogram)

}

histogram()