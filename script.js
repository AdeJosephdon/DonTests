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

        for (const sheetName of workbook.SheetNames) {
            worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }

        let arrayOfStringsSheet1 = JSON.stringify(worksheets.Pressure_Time_Data);
        let arrayOfStringsSheet2 = JSON.stringify(worksheets.Calculation_data);

        // console.log(arrayOfStringsSheet1)

        document.getElementById("tests").selectedIndex = 0; //this returns the dropdown list to the initial "Select a test"

        
        d3.select("#chart-container").selectAll("*").remove(); // this clears the old chart when a new file is loaded.

        // document.getElementById("dataTable").innerHTML = ""  // This clears the already created table when a new file is loaded.

        // Converting the JSON from string to an array 
        let arrayOfObjectsSheet1 = JSON.parse(arrayOfStringsSheet1); //for pressure time data
        let arrayOfObjectsSheet2 = JSON.parse(arrayOfStringsSheet2); //for calculation data

        // console.log(arrayOfObjects);
        // console.log(arrayOfObjectsSheet1);
        // console.log(arrayOfObjectsSheet2);
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
        const Pressure_ = extractPressure(arrayOfObjectsSheet1);
        // Output the array of names
        console.log(Pressure_);
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
        // Output the array of time
        console.log(time);
        // Function to extract "time" values into a separate array (end)

        // Function to extract "pressure" values into a separate array (start)
        function extractFlowRate(data) {
            const flowRate = [];
            data.forEach(P => {
                if (P.hasOwnProperty("FlowRate")) {
                    flowRate.push(P.FlowRate);
                }
            });
            return flowRate;
        }
        // Extract names from jsonData
        const FlowRate_ = extractFlowRate(arrayOfObjectsSheet1);
        // Output the array of names
        console.log(FlowRate_);
        // Function to extract "pressure" values into a separate array (end)


// Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_);

        // SemiLogGraph(time, Pressure_)

        // function that draws the Cartesian curve
// function CartesianGraph(time, Pressure_) {
//         // Line chart (Start)
// const x = time;
// const y = Pressure_;

// // Set dimensions and margins for the chart
// const margin = {top: 70, right:30, bottom: 40, left: 80};
// const width = 1200 - margin.left - margin.right;
// const height = 500 - margin.top -margin.bottom;


// // Append axes to SVG
// const svg = d3.select("#chart-container") //we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
//     .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

// // Set up the x and y scales
// const xScale = d3.scaleLinear()
//     .domain([d3.min(x), d3.max(x)])
//     .range([0, width]);

// const yScale = d3.scaleLinear()
//     .domain([d3.min(y), d3.max(y)])
//     .range([height, 0]);


// // Create line generator
// const line = d3.line()
//     .x(d => xScale(d.x))
//     .y(d => yScale(d.y));

// // Prepare the data
// const data_ = x.map((d, i) => ({x: d, y: y[i]}));

// // Add the line path
// svg.append("path")
//     .datum(data_)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 1.5)
//     .attr("d", line);


// // Plot data points
// svg.selectAll("circle")
//     .data(data_)
//     .enter().append("circle")
//     .attr("cx", d => xScale(d.x))
//     .attr("cy", d => yScale(d.y))
//     .attr("r", 3);


// // Add x-axis
// svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(xScale));

// // Add y-axis
// svg.append("g")
//     .call(d3.axisLeft(yScale));

    // }

// function for Horner plot
// hornerPlot(time, Pressure_, arrayOfObjectsSheet2);


function hornerPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2
    let time_of_production = Calculation_data_array[0].Production_time;

    console.log("pressure_array",pressure_array);
    console.log("time_array",time_array);
    console.log(Calculation_data_array[0]);

    // If the total production time is to be calculated from the cummulative production.
    if ( typeof time_of_production === "undefined") {
        time_of_production = (24 * Calculation_data_array[0].cumulative_production) / Calculation_data_array[0].Flow_rate

        // console.log("No")
    } else {
        // console.log("yes")
        time_of_production = Calculation_data_array[0].Production_time;
    }

    console.log(time_of_production);

    const hornerArray = time_array.map(function(d) {
        return (d + time_of_production) / d;
    });

    console.log(pressure_array);

    const reversedHorner_array = hornerArray.reverse()
    const reversedpressure_array = pressure_array.reverse()
    console.log("reversedHorner_array",reversedHorner_array);
    console.log("reversedpressure_array",reversedpressure_array);

 
    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
        const x = reversedHorner_array.slice(0, -1);
        const y = reversedpressure_array.slice(0, -1);

        console.log("x",x);
        console.log("y",y);

        // const v = x.slice().reverse();
        // const w = y.slice().reverse();

        // console.log("v and w below");
        // console.log("v",v);
        // console.log("w",w);


Semi_LogGraph(x, y)

function Semi_LogGraph(time, pressure_data) {
    // Line chart (Start)
    const xData = time;
    const yData = pressure_data;

    // Function to find the next lowest multiple of 10
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
    // Function to find the next lowest multiple of a given range
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }
    // Function to find the next highest range
    function nextHighestRange(value, range) {
        return Math.ceil(value / range) * range;
    }


    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append SVG object to #chart-container of the page
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([xMin, xMax])
        .range([width, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        // Prepare the data
        const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    // console.log(data_)

// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Prepare the data
            // const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));
            const originalData = original_Data;

            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d;
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d;
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');

        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            const straightLogXData = straightXData.map(d => Math.log(d));
            // let log_x = x.map(value => Math.log(value));
            const straightYData = yData.slice(startIndex, endIndex + 1);
        // Perform linear regression on the selected x-values and y-values
console.log(straightLogXData);
console.log(straightYData);
        // Function to perform linear regression.
        // const linearRegression = (x, y) => {
        //         const n = x.length;
        //         const sumX = d3.sum(x);
        //         const sumY = d3.sum(y);
        //         const sumXY = d3.sum(x.map((d, i) => d * y[i]));
        //         const sumXX = d3.sum(x.map(d => d * d));
        //         const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        //         const intercept = (sumY * sumXX - sumX * sumXY) / (n * sumXX - sumX * sumX);
        //         return { slope, intercept };
        //     };
        // const { slope, intercept} = linearRegression(straightLogXData, straightYData);

const x_mean = straightLogXData.reduce((a, b) => a + b, 0) / straightLogXData.length;
const y_mean = straightYData.reduce((a, b) => a + b, 0) / straightYData.length;

let numerator = 0;
let denominator = 0;

for (let i = 0; i < straightLogXData.length; i++) {
    numerator += (straightLogXData[i] - x_mean) * (straightYData[i] - y_mean);
    denominator += (straightLogXData[i] - x_mean) ** 2;
}

const slope = numerator / denominator;
const intercept = y_mean - slope * x_mean;

        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));
console.log("original slope:", slope);
        // Output the slope
        const math = Math; // Reference the Math library for mathematical functions

        const actualSlope = math.exp(slope) - 1;

        const newSlope = actualSlope.toFixed(2)
        const newIntercept = intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.


    // Generate points for the straight line
    const straightLineData = [];
    for (let i = xMin; i <= xMax; i *= 10) {
        const y = slope * Math.log(i) + intercept;
        straightLineData.push({ x: i, y: y });
    }

    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (intercept < yMinDomain) {
        yMinDomain = nextLowestRange(intercept, yScaleRange);
    }

     // Calculate new yMaxDomain based on intercept if necessary
    let yMaxDomain = nextHighestRange(d3.max(yData), yScaleRange);
    if (intercept > yMaxDomain) {
        yMaxDomain = nextHighestRange(intercept, yScaleRange);
    }

    // const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // // Prepare the original data
            // const originalData = xData.map((gOg bd, i) => ({x: d, y: yData[i]}));

            // Add the original line path
            svg.selectAll(".line1").remove();
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.selectAll('.line3').remove();
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("d", straightLine);

            // Plot data points for original data
            svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);


    // Calculate permeability
    const permeability = (162.2 *  Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);
    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    const yValue = (slope * 1) + intercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (newIntercept)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log(yValue)
console.log("skin: ", decimaledskinFactor);


// Write the calculation steps
document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 
            <p>Our approach is to plot \\( p_{ws} \\) vs. \\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\), identify the position of the middle-time line, and determine whether the late-time data fall on a line with slope double that of the middle-time line. If so, then the straightforward double-slope method can be used to estimate the distance to the boundary. If not, a more complicated calculation is required.</p>

            <p>1. Construct a Horner semilog plot above with the plotting functions given in Table below.</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
            \\]

            \\[
            = \\frac{${absoluteSlope}}{1} = ${absoluteSlope} \\text{ psi/cycle.}
            \\]

            <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

            \\[
            k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Flow_rate})(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
            \\]
            <p>4. The skin factor will be calculated using</p>
            \\[
            s = 1.1513 \\left[ \\frac{P_{1hr} - P_{wf}}{m} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = 1.1513 \\left[ \\frac{(${yValue}) - ${Calculation_data_array[0].Initial_Pressure}}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = ${decimaledskinFactor}
            \\]

            <p>4. The slope of the best-fit straight line drawn through the later data (i.e., the late-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
            \\]

            \\[
            = \\frac{6876.2 - 6888.2}{\\log(100) - \\log(10)}
            \\]

            \\[
            = \\frac{-12}{1} = 12 \\text{ psi/cycle.}
            \\]

            <p>Note that this slope is two times greater than that determined in Step 2. From the Horner plot shown in Fig. 2.32, the Horner time ratio at which the middle- and late-time straight lines intersect is \\( t_p + \\Delta t_i/\\Delta t_i = 405 \\), from which we calculate \\( \\Delta t_i = 0.99 \\) hours. Thus, the distance from the well to the fault is estimated to be</p>

            \\[
            L = \\left( \\frac{0.000148 \\Delta t_i}{\\phi \\mu c_t} \\right)^{\\frac{1}{2}} = \\left( \\frac{(0.000148)(249.6)(0.99)}{(0.22)(0.6)(12.7 \\times 10^{-6})} \\right)^{\\frac{1}{2}}
            \\]

            \\[
            = 1477.7 \\text{ ft.}
            \\]

            <p>The time required for the slope to double (Eq. 2.91) is estimated to be</p>

            \\[
            \\Delta t = \\frac{3.8 \\times 10^5 \\phi \\mu c_t L^2}{k}
            \\]

            \\[
            = \\frac{(3.8 \\times 10^5)(0.22)(0.6)(12.7 \\times 10^{-6})(1477.7)^2}{249.6}
            \\]

            \\[
            = 55.7 \\text{ hours,}
            \\]

            <p>which is much shorter than the duration of the buildup test (i.e., 120 hours). We should note that this pressure-buildup test was conducted without wellbore-storage effects. In practice, however, these effects will...</p>
        `;

// Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>
        <th>Horner Time <br> <p> \\[ \\frac{t_{p} + \\Delta t}{\\Delta t} \\] </p></th>
    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const pressureArrayReversedAgain = Pressure_.reverse(); //reversed for table.
const hornerArrayReversedAgain = hornerArray.reverse();
const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        time.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = pressureArrayReversedAgain[index];
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = hornerArrayReversedAgain[index];
            row.appendChild(cell3);
            
            tableBody.appendChild(row);
        });
}

}
// New Line ends here
    }
// HornerPlot ends here
// drawdownPlot(time, Pressure_, arrayOfObjectsSheet2);

// Constant-Rate Flow Tests.
function drawdownPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2

    console.log(Calculation_data_array[0]);


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values

        // Select the range of points that form the straight line (radial flow zone)
        const startIndex = 1; 
        const endIndex = 19;    

        const selectedX = time_array.slice(startIndex, endIndex + 1);
        const selectedY = pressure_array.slice(startIndex, endIndex + 1);

        console.log("SelectedX: ",selectedX);

        // Change selected x-axis values to their logarithmic values (base 10)
        const log_X = selectedX.map(value => Math.log10(value));

        // Perform linear regression on the selected x-values and y-values
        const { slope, intercept, n, sumXY, sumX, sumY, sumXX} = linearRegression(log_X, selectedY);

        console.log("SelectedX: ",log_X);

        // Function to perform linear regression
        function linearRegression(logX, y) {
            const n = logX.length;
            const sumX = logX.reduce((a, b) => a + b, 0); //https://www.youtube.com/watch?v=g1C40tDP0Bk about the reduce method
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = logX.reduce((sum, xVal, index) => sum + xVal * y[index], 0);
            const sumXX = logX.reduce((sum, xVal) => sum + xVal * xVal, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return { slope, intercept, n, sumXY, sumX, sumY, sumXX};
        }


        // Output the slope
        const newSlope = slope.toFixed(2)
        const newIntercept = intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.
    // Function to find y value for a given x value using the regression line
    function findYForX(xValue, slope, intercept) {
        // const logXValue = Math.log10(xValue);
        return slope * xValue + intercept;
    }

    // Example usage to find y value for a given x value  
    const yValue = findYForX(1, slope, intercept);
    const maxValue = findYForX(0.1, slope, intercept);
    const newYValue = findYForX(10, slope, intercept);

    console.log('Y value:',yValue);
    // Calculate permeability
    const permeability = (162.2 * Calculation_data_array[0].Flow_rate * Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);
    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (Calculation_data_array[0].Initial_Pressure - yValue)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log("skin: ", decimaledskinFactor);


// Semi_LogGraph(time_array, pressure_array, absoluteSlope, maxValue, selectedX, selectedY) nm
Semi_LogGraph(time_array, pressure_array)

function Semi_LogGraph(time, Pressure_) {
// function Semi_LogGraph(time, Pressure_, slope, maxValue, selectedX, selectedY) { nm
    // Line chart (Start)
    const xData = time;
    const yData = Pressure_;
    // const slope_ = slope;nm
    // const maxValueForY = maxValue;nm
    // const yValueForSL = selectedY;nm
    // const xValueForSL = selectedX;nm


    // Function to find the next lowest multiple of 10 (this will be used for x axis)
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10 (this will be used for x axis)
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
    // Function to find the next lowest multiple of a given range (this will be used for y axis)
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }
    // Function to find the next highest range (this will be used for y axis)
    function nextHighestRange(value, range) {
        return Math.ceil(value / range) * range;
    }

    // Calculate new yMaxDomain based on intercept if necessary
//     let yMaxDomain = nextHighestRange(d3.max(yData), yScaleRange);
//     if (intercept > yMaxDomain) {
//         yMaxDomain = nextHighestRange(intercept, yScaleRange);
//     }



    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append axes to SVG
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
const maximum_scale = 0.1

    // // Set up the x and y scales
    // const maxX = d3.max(x);nm
    // const xScale = d3.scaleLog()nm
    //     .domain([maximum_scale, Math.pow(10, Math.ceil(Math.log10(maxX)))])nm
    //     .range([0, width]);nm

    // const yScale = d3.scaleLinear()nm
    //     .domain([d3.min(y), d3.max(y)])nm
    //     .range([height, 0]);nm

    // // Create line generator
    // const line = d3.line()nm
    //     .x(d => xScale(d.x))nm
    //     .y(d => yScale(d.y));nm

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    // console.log(xMin);

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([maximum_scale, xMax])
        .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(10, ",.1s"));


    // Prepare the data
    // const data_ = x.map((d, i) => ({x: d, y: y[i]}));nm

    // console.log(data_)nm
    const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    console.log(originalData)

// nm from here
    // // Add the line path
    // svg.append("path")
    //     .datum(data_)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line);

    // // Plot data points
    // svg.selectAll("circle")
    //     .data(data_)
    //     .enter().append("circle")
    //     .attr("cx", d => xScale(d.x))
    //     .attr("cy", d => yScale(d.y))
    //     .attr("r", 3);

    // // Add x-axis
    // svg.append("g")
    //     .attr("transform", `translate(0,${height})`)
    //     .call(d3.axisBottom(xScale).ticks(10, ",.1s"));

    // // Add y-axis
    // svg.append("g")
    //     .call(d3.axisLeft(yScale));

    // // Add grid lines
    // svg.append("g")
    //     .attr("class", "grid")
    //     .attr("transform", `translate(0,${height})`)
    //     .call(d3.axisBottom(xScale)
    //         .tickSize(-height)
    //         .tickFormat("")
    //     );

    // svg.append("g")
    //     .attr("class", "grid")
    //     .call(d3.axisLeft(yScale)
    //         .tickSize(-width)
    //         .tickFormat("")
//         );

// // Create straightline to be superimposed
// const xForStraighline = [maximum_scale, xValueForSL[xValueForSL.length - 1]] //X-value chosen are 1. the last value of the selectedX value and 1 (where we have the intercept)
// const yForStraighline = [maxValueForY, yValueForSL[yValueForSL.length - 1]]
// // Y-value chosen are 1. the last value of the selectedY value and the intercept

// nm ends here

// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Prepare the data
            // const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));
            const originalData = original_Data;

            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// // Create straight line data points
//     const regLineData = xForStraighline.map((d, i) => ({x: d, y: yForStraighline[i]})); nm

//     console.log("Regression line data",regLineData); nm

// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d;
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d;
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');


        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            const straightLogXData = straightXData.map(d => Math.log(d));

            // console.log("xData: ",xData)
            // console.log("yData: ",yData)
            // console.log(straightLogXData)

            const straightYData = yData.slice(startIndex, endIndex + 1);

            // console.log(straightYData)

        // Perform linear regression on the selected x-values and y-values

        // Function to perform linear regression.
        function linearRegression(x, y) {
            const n = x.length;
                const sumX = d3.sum(x);
                const sumY = d3.sum(y);
                const sumXY = d3.sum(x.map((d, i) => d * y[i]));
                const sumXX = d3.sum(x.map(d => d * d));
                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                const intercept = (sumY - slope * sumX) / n;
                return { slope, intercept };
        }
        const { slope, intercept} = linearRegression(straightLogXData, straightYData);
        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));

        // Output the slope
        const newSlope = slope.toFixed(2)
        const newIntercept = intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.


    // Generate points for the straight line
    const straightLineData = [];
    for (let i = 0.1; i <= xMax; i *= 10) {
        const y = slope * Math.log(i) + intercept;
        straightLineData.push({ x: i, y: y });
    }

    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (intercept < yMinDomain) {
        yMinDomain = nextLowestRange(intercept, yScaleRange);
    }

    const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // // Prepare the original data
            // const originalData = xData.map((gOg bd, i) => ({x: d, y: yData[i]}));

            // Add the original line path
            svg.selectAll(".line1").remove();
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.selectAll('.line3').remove();
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("d", straightLine);

            // Plot data points for original data
            svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);


    // Calculate permeability
    const permeability = (162.2 *  Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);

    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    const yValue = (slope * 1) + intercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (newIntercept)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log(yValue)
console.log("skin: ", decimaledskinFactor);


// Write the calculation steps

document.getElementById("calculations-container").innerHTML = `
    <h2>Solution</h2> 
    <p>Our approach is to plot \\( p_{wf} \\) vs. \\( t_p \\), identify the position of the middle-time line, and determine whether the late-time data fall on a line with slope double that of the middle-time line. If so, then the straightforward double-slope method can be used to estimate the distance to the boundary. If not, a more complicated calculation is required.</p>

    <p>1. Construct a Horner semilog plot above with the plotting functions given in Table below.</p>

    <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

    \\[
    m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( t_2 \\right) - \\log \\left( t_1 \\right)}
    \\]

    \\[
    = \\frac{${newYValue} - ${yValue}}{\\log(10) - \\log(1)}
    \\]

    \\[
    = \\frac{${absoluteSlope}}{1} = ${absoluteSlope} \\text{ psi/cycle.}
    \\]

    <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

    \\[
    k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Flow_rate})(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
    \\]

    <p>4. The skin factor will be calculated using</p>
    \\[
    s = 1.1513 \\left[ \\frac{P_{1hr} - P_{wf}}{m} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
    \\]
    \\[
    s = 1.1513 \\left[ \\frac{(${yValue}) - ${Calculation_data_array[0].Initial_Pressure}}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
    \\]
    \\[
    s = ${decimaledskinFactor}
    \\]

    <p>4. The slope of the best-fit straight line drawn through the later data (i.e., the late-time region) is</p>

    \\[
    m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
    \\]

    \\[
    = \\frac{6876.2 - 6888.2}{\\log(100) - \\log(10)}
    \\]

    \\[
    = \\frac{-12}{1} = 12 \\text{ psi/cycle.}
    \\]

    <p>Note that this slope is two times greater than that determined in Step 2. From the Horner plot shown in Fig. 2.32, the Horner time ratio at which the middle- and late-time straight lines intersect is \\( t_p + \\Delta t_i/\\Delta t_i = 405 \\), from which we calculate \\( \\Delta t_i = 0.99 \\) hours. Thus, the distance from the well to the fault is estimated to be</p>

    \\[
    L = \\left( \\frac{0.000148 \\Delta t_i}{\\phi \\mu c_t} \\right)^{\\frac{1}{2}} = \\left( \\frac{(0.000148)(249.6)(0.99)}{(0.22)(0.6)(12.7 \\times 10^{-6})} \\right)^{\\frac{1}{2}}
    \\]

    \\[
    = 1477.7 \\text{ ft.}
    \\]

    <p>The time required for the slope to double (Eq. 2.91) is estimated to be</p>

    \\[
    \\Delta t = \\frac{3.8 \\times 10^5 \\phi \\mu c_t L^2}{k}
    \\]

    \\[
    = \\frac{(3.8 \\times 10^5)(0.22)(0.6)(12.7 \\times 10^{-6})(1477.7)^2}{249.6}
    \\]

    \\[
    = 55.7 \\text{ hours,}
    \\]

    <p>which is much shorter than the duration of the buildup test (i.e., 120 hours). We should note that this pressure-buildup test was conducted without wellbore-storage effects. In practice, however, these effects will...</p>
`;

// Reprocess the LaTeX content with MathJax
MathJax.typeset();

        // Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>

    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        xData.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = yData[index];
            row.appendChild(cell2);

            
            tableBody.appendChild(row);
        });
    }


    // // Add straight line on the same chart
    // svg.append("path")
    //     .datum(regLineData)
    //     .attr("fill", "none")
    //     .attr("stroke", "green")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x(d => xScale(d.x))
    //         .y(d => yScale(d.y))
    //     );nm

}
//Line chart end
    }


// Variable-Rate Testing With Smoothly Changing Rates.
// Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_);
function Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2
    const flowRate = FlowRate_

    console.log(Calculation_data_array[0]);


    variableRatePressure(pressure_array, time_array, flowRate,Calculation_data_array[0].Initial_Pressure)
    
    function variableRatePressure(pressure_array, time_array, flowRate, Initial_Pressure) {
        // console.log("Initial_Pressure: ",Initial_Pressure);
            const vrpTable = [];
            pressure_array.forEach((P, index) => {
            // console.log("Pressure: ", P);
            const q = (Initial_Pressure - P) / flowRate[index]

            vrpTable.push(q.toFixed(2))
            });
            return vrpTable;
        }
        // Extract names from jsonData
        // const Pressure_ = extractPressure(arrayOfObjectsSheet1);
        // Output the array of names
    const variable = variableRatePressure(pressure_array, time_array, flowRate,Calculation_data_array[0].Initial_Pressure)

    console.log(variable);


Semi_LogGraph(time_array, variable)
function Semi_LogGraph(time, variable_data) {
    // Line chart (Start)
    const xData = time;
    const yData = variable_data;

    // Function to find the next lowest multiple of 10
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
// Function to find the next lowest multiple of a given range
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }

    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append SVG object to #chart-container of the page
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([xMin, xMax])
        .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        // Prepare the data
        const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    // console.log(data_)

// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Prepare the data
            // const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));
            const originalData = original_Data;

            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d;
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d;
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');

        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            const straightLogXData = straightXData.map(d => Math.log(d));

            // console.log("xData: ",xData)
            // console.log("yData: ",yData)
            // console.log(straightLogXData)

            const straightYData = yData.slice(startIndex, endIndex + 1);

            // console.log(straightYData)

        // Perform linear regression on the selected x-values and y-values

        // Function to perform linear regression.
        function linearRegression(x, y) {
            const n = x.length;
                const sumX = d3.sum(x);
                const sumY = d3.sum(y);
                const sumXY = d3.sum(x.map((d, i) => d * y[i]));
                const sumXX = d3.sum(x.map(d => d * d));
                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
                const intercept = (sumY - slope * sumX) / n;
                return { slope, intercept };
        }
        const { slope, intercept} = linearRegression(straightLogXData, straightYData);
        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));

        // Output the slope
        const newSlope = slope.toFixed(2)
        const newIntercept = intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.


    // Generate points for the straight line
    const straightLineData = [];
    for (let i = xMin; i <= xMax; i *= 10) {
        const y = slope * Math.log(i) + intercept;
        straightLineData.push({ x: i, y: y });
    }

    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (intercept < yMinDomain) {
        yMinDomain = nextLowestRange(intercept, yScaleRange);
    }

    const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // // Prepare the original data
            // const originalData = xData.map((gOg bd, i) => ({x: d, y: yData[i]}));

            // Add the original line path
            svg.selectAll(".line1").remove();
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.selectAll('.line3').remove();
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("d", straightLine);

            // Plot data points for original data
            svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);


    // Calculate permeability
    const permeability = (162.2 *  Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);

    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    const yValue = (slope * 1) + intercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (newIntercept)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log(yValue)
console.log("skin: ", decimaledskinFactor);


// Write the calculation steps

document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 
            <p>Our approach is to plot \\( p_{wf} \\) vs. \\( t_p \\), identify the position of the middle-time line, and determine whether the late-time data fall on a line with slope double that of the middle-time line. If so, then the straightforward double-slope method can be used to estimate the distance to the boundary. If not, a more complicated calculation is required.</p>

            <p>1. Construct a Horner semilog plot above with the plotting functions given in Table below.</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( t_2 \\right) - \\log \\left( t_1 \\right)}
            \\]

            \\[
            = \\frac{${yValue} - ${yValue}}{\\log(10) - \\log(1)}
            \\]

            \\[
            = \\frac{${absoluteSlope}}{1} = ${absoluteSlope} \\text{ psi/cycle.}
            \\]

            <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

            \\[
            k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
            \\]
            <p>4. The skin factor will be calculated using</p>
            \\[
            s = 1.1513 \\left[ \\frac{P_{1hr} - P_{wf}}{m} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = 1.1513 \\left[ \\frac{(${yValue}) - ${Calculation_data_array[0].Initial_Pressure}}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = ${decimaledskinFactor}
            \\]

            <p>4. The slope of the best-fit straight line drawn through the later data (i.e., the late-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
            \\]

            \\[
            = \\frac{6876.2 - 6888.2}{\\log(100) - \\log(10)}
            \\]

            \\[
            = \\frac{-12}{1} = 12 \\text{ psi/cycle.}
            \\]

            <p>Note that this slope is two times greater than that determined in Step 2. From the Horner plot shown in Fig. 2.32, the Horner time ratio at which the middle- and late-time straight lines intersect is \\( t_p + \\Delta t_i/\\Delta t_i = 405 \\), from which we calculate \\( \\Delta t_i = 0.99 \\) hours. Thus, the distance from the well to the fault is estimated to be</p>

            \\[
            L = \\left( \\frac{0.000148 \\Delta t_i}{\\phi \\mu c_t} \\right)^{\\frac{1}{2}} = \\left( \\frac{(0.000148)(249.6)(0.99)}{(0.22)(0.6)(12.7 \\times 10^{-6})} \\right)^{\\frac{1}{2}}
            \\]

            \\[
            = 1477.7 \\text{ ft.}
            \\]

            <p>The time required for the slope to double (Eq. 2.91) is estimated to be</p>

            \\[
            \\Delta t = \\frac{3.8 \\times 10^5 \\phi \\mu c_t L^2}{k}
            \\]

            \\[
            = \\frac{(3.8 \\times 10^5)(0.22)(0.6)(12.7 \\times 10^{-6})(1477.7)^2}{249.6}
            \\]

            \\[
            = 55.7 \\text{ hours,}
            \\]

            <p>which is much shorter than the duration of the buildup test (i.e., 120 hours). We should note that this pressure-buildup test was conducted without wellbore-storage effects. In practice, however, these effects will...</p>
        `;

        // Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>
        <th>\\( \\left( \\frac{(P_{i} - P_{wf})}{q} \\right) \\text{ psia} \\)</th>
    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        time.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);

console.log(Pressure_[index]);

            const cell2 = document.createElement('td');
            cell2.textContent = Pressure_[index];
            row.appendChild(cell2);

console.log(variable[index]);

            const cell3 = document.createElement('td');
            cell3.textContent = variable[index];
            row.appendChild(cell3);

            
            tableBody.appendChild(row);
        });
}

    // // Create line generator
    // const line = d3.line()
    //     .x(d => xScale(d.x))
    //     .y(d => yScale(d.y));

    // // Prepare the data
    // const data_ = x.map((d, i) => ({x: d, y: y[i]}));

    // console.log(data_)

    // // // Add the line path
    // // svg.append("path")
    // //     .datum(data_)
    // //     .attr("fill", "none")
    // //     .attr("stroke", "steelblue")
    // //     .attr("stroke-width", 1.5)
    // //     .attr("d", line);

    // // Plot data points
    // svg.selectAll("circle")
    //     .data(data_)
    //     .enter().append("circle")
    //     .attr("cx", d => xScale(d.x))
    //     .attr("cy", d => yScale(d.y))
    //     .attr("r", 3);

    // // // Add x-axis
    // // svg.append("g")
    // //     .attr("transform", `translate(0,${height})`)
    // //     .call(d3.axisBottom(xScale).ticks(10, ",.1s"));

    // // Add y-axis
    // svg.append("g")
    //     .call(d3.axisLeft(yScale));

    // // Add grid lines
    // svg.append("g")
    //     .attr("class", "grid")
    //     .attr("transform", `translate(0,${height})`)
    //     .call(d3.axisBottom(xScale)
    //         .tickSize(-height)
    //         .tickFormat("")
    //     );

    // svg.append("g")
    //     .attr("class", "grid")
    //     .call(d3.axisLeft(yScale)
    //         .tickSize(-width)
    //         .tickFormat("")
    //     );



}
//Line chart end
        

    }

// function that triggers the appropriate well test triggerFunction(functionName)

function handleDropdownChange() {
        const selectedValue = document.getElementById("tests").value;

        if (selectedValue === "Variable_RatePlot") {
            Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_);
        } else if (selectedValue === "hornerPlot") {
            hornerPlot(time, Pressure_, arrayOfObjectsSheet2);
        } else if (selectedValue === "drawdownPlot") {
            drawdownPlot(time, Pressure_, arrayOfObjectsSheet2);
        }
    };

    window.handleDropdownChange = handleDropdownChange;
};
    reader.readAsArrayBuffer(file);
};

document.getElementById('fileInput').addEventListener('change', handleFileInput);
    


