const chartContainer = d3.select("#chart");

const margin = { top: 20, right: 20, bottom: 50, left: 80 };
const maxWidth = 800;
let width = Math.min(maxWidth, parseInt(chartContainer.style("width"))) - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = chartContainer
  .append("svg")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

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

    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style("text-anchor", "middle")
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
      .text("Valor del PIB (Miles de millones de dólares)");

    svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", width / dataset.length + 0.2)
      .attr("height", d => height - yScale(d[1]))
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "#1E90FF");

    const tooltip = chartContainer
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg.selectAll(".bar")
      .on("mouseover", (event, d) => {
        const [date, gdp] = d;
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${date}<br>${gdp}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`)
          .attr("data-date", date);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  })
  .catch(error => console.error(error));
