const chartContainer = d3.select("#chart");

const margin = { top: 40, right: 20, bottom: 40, left: 60 };
const maxWidth = 800;
const containerWidth = Math.min(maxWidth, parseInt(chartContainer.style("width")));
const width = containerWidth - margin.left - margin.right;
const height = Math.max(300, containerWidth * 0.6) - margin.top - margin.bottom;

const svg = chartContainer
  .append("svg")
  .attr("viewBox", `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const verticalLine = svg.append("line")
  .attr("stroke", "black")
  .attr("y1", 0)
  .attr("y2", height)
  .attr("opacity", 0);

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(response => response.json())
  .then(data => {
    const dataset = data.data;

    const xScale = d3.scaleTime()
      .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height, 0]);

    const tickAmount = containerWidth < 400 ? 5 : 10;
    const xAxis = d3.axisBottom(xScale).ticks(tickAmount);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.select("#x-axis")
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style("text-anchor", "middle")
      .style("font-size", containerWidth < 400 ? "10px" : "14px")
      .text("Fecha");

    svg.append("g")
      .attr("id", "y-axis")
      .call(yAxis);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", containerWidth < 400 ? "10px" : "14px")
      .text("Valor del PIB (Miles de millones de dólares)");

    svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", Math.max(1, width / dataset.length - 1))
      .attr("height", d => height - yScale(d[1]))
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "#1E90FF")
      .on("mouseover", (event, d) => {
        const [date, gdp] = d;
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Fecha: ${date}<br>PIB: $${gdp} Billones`)
          .style("left", `${Math.min(event.pageX, window.innerWidth - 150)}px`)
          .style("top", `${event.pageY - 60}px`)
          .attr("data-date", date);

        const xPos = xScale(new Date(date));
        verticalLine.attr("x1", xPos).attr("x2", xPos).style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
        verticalLine.style("opacity", 0);
      });

  })
  .catch(error => console.error(error));
