var sidebarOPen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if(!sidebarOPen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOPen = true
    }
}

function closeSidebar() {
    if(!sidebarOPen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOPen = false
    }
}



// d3.select("#chart-containe").attr("name", "fred")                                  

// Line chart (Start)

// Set dimensions and margins for the chart
const margin = {top: 70, right:30, bottom: 40, left: 80};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top -margin.bottom;

// Set up the x and y scales
// 
// const x = d3.scaleTime()
//     .range([0, width]);

// const y = d3.scaleLinear()
//     .range([height, 0]);
// 

const x = [1, 2, 3, 4];
const y = [1, 2, 3, 4];

// Set up the x and y scales
const xScale = d3.scaleLog()
    .domain([1, d3.max(x)])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(y)])
    .range([height, 0]);

    // Create axes
const xAxis = d3.axisBottom(xScale)
    .ticks(10, d3.format(",d"));
const yAxis = d3.axisLeft(yScale);

    // Append axes to SVG
const svg = d3.select("#chart-container") //we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Plot data points
    svg.selectAll("circle")
        .data(x.map((d, i) => ({x: d, y: y[i]})))
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3);

 // Add vertical gridlines
    svg.selectAll("xGrid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", .5);

// // Add horizontal gridlines

svg.selectAll("yGrid")
.data(y.ticks((d3.max(dataset, d => d.value) - 65000) / 5000).slice(1))
.join("line")
.attr("x1", 0)
.attr("x2", width)
.attr("y1", d => y(d))
.attr("y2", d => y(d))
.attr("stroke", "#e0e0e0")
.attr("stroke-width", .5)

// Create the line generator

    const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

// Add the line path to the SVG element

    svg.append("path")
    .datum(dataset)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line);



 // Sample data arrays
        // Create scales
// 
        // const xScale = d3.scaleLog()
        //     .domain([1, d3.max(x)])
        //     .range([margin.left, width - margin.right]);

        // const yScale = d3.scaleLinear()
        //     .domain([0, d3.max(y)])
        //     .range([height - margin.bottom, margin.top]);
// 



        // Function to interpolate y values for given x values
        function interpolateY(xValue) {
            const i = d3.bisectLeft(x, xValue);
            if (i > 0) {
                const x0 = x[i - 1], y0 = y[i - 1];
                const x1 = x[i], y1 = y[i];
                const t = (xValue - x0) / (x1 - x0);
                return y0 + t * (y1 - y0);
            } else {
                return y[0];
            }
        }

        // Function to calculate the slope
        function calculateSlope() {
            const x1 = 1;
            const x10 = 10;

            const y1 = interpolateY(x1);
            const y10 = interpolateY(x10);

            const logX1 = Math.log10(x1);
            const logX10 = Math.log10(x10);

            const slope = (y10 - y1) / (logX10 - logX1);

            document.getElementById('result').textContent = 'Slope: ' + slope.toFixed(4);
        }


// Overall function that is triggered when the excel file has been uploaded
function handleFileInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // This function is triggered after the file being read has loaded
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // convert excel file to JSON
        let worksheets = {};

        // let Sheet1 =  workbook.SheetNames[0]
        console.log(workbook.SheetNames[0]);

        for (const sheetName of workbook.SheetNames) {
            worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            // console.log(worksheets[sheetName]);
        }

        // console.log(worksheets)

        let arrayOfStringsSheet1 = JSON.stringify(worksheets.Pressure_Time_Data);
        let arrayOfStringsSheet2 = JSON.stringify(worksheets.Calculation_data);

        // console.log(arrayOfStringsSheet1)

        // Converting the JSON from string to an array 
        let arrayOfObjectsSheet1 = JSON.parse(arrayOfStringsSheet1);
        let arrayOfObjectsSheet2 = JSON.parse(arrayOfStringsSheet2);

        // console.log(arrayOfObjects);
        // console.log(arrayOfObjectsSheet1);
        console.log(arrayOfObjectsSheet2);
        // console.log(arrayOfObjectsSheet2.length);

        // Function to extract "pressure" values into a separate array (start)
        function extractPressure(data) {
            const pressure = [];
            data.forEach(P => {
                if (P.hasOwnProperty("Pressure")) {
                    pressure.push(P.Pressure);
                }
            });
            return pressure;
        }
        // Extract names from jsonData
        const names = extractPressure(arrayOfObjectsSheet1);
        // Output the array of names
        console.log(names);
        // Function to extract "pressure" values into a separate array (end)


        
        // Function to extract "time" values into a separate array (start)
        function extractTime(data) {
            const time = [];
            data.forEach(T => {
                if (T.hasOwnProperty("Time")) {
                    time.push(T.Time);
                }
            });
            return time;
        }
        // Extract names from jsonData
        const time = extractTime(arrayOfObjectsSheet1);
        // Output the array of names
        console.log(time);
        // Function to extract "time" values into a separate array (end)

        // function to extract the various calculation data.
        // console.log(arrayOfObjectsSheet2[0].Flow_rate);

        // Function to calculate the permeability (drawdown)


        // Function to calculate the Skin factor (drawdown)



};
    reader.readAsArrayBuffer(file);
};

document.getElementById('fileInput').addEventListener('change', handleFileInput);
    