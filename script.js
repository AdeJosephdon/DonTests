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
        // Output the array of names
        console.log(time);
        // Function to extract "time" values into a separate array (end)

        // function to extract the various calculation data.
        // console.log(arrayOfObjectsSheet2[0].Flow_rate);

        // Function to calculate the permeability (drawdown)


        // Function to calculate the Skin factor (drawdown)

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
hornerPlot(time, Pressure_, arrayOfObjectsSheet2);

function hornerPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2
    let time_of_production = Calculation_data_array[0].Production_time;

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

    const reversedHorner_array = hornerArray.reverse()
    const reversedpressure_array = pressure_array.reverse()
    // console.log(reversedHorner_array);
    // console.log(reversedpressure_array);

 


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
        const x = reversedHorner_array.slice(0, -1);
        const y = reversedpressure_array.slice(0, -1);

        console.log(x);
        console.log(y);

        const v = x.slice().reverse();
        const w = y.slice().reverse();

        console.log("v and w below");
        console.log(v);
        console.log(w);



        // Select the range of points that form the straight line (radial flow zone)
        const startIndex = 5;  // Start index of the straight line section
        const endIndex = 12;    // End index of the straight line section

        const selectedX = x.slice(startIndex, endIndex + 1);
        const selectedY = y.slice(startIndex, endIndex + 1);

        console.log("SelectedX: ",selectedX);

        // Change selected x-axis values to their logarithmic values (base 10)
        const log_X = selectedX.map(value => Math.log10(value));

        // Perform linear regression on the selected x-values and y-values
        const { slope, intercept, n, sumXY, sumX, sumY, sumXX} = linearRegression(log_X, selectedY);

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
        const logXValue = Math.log10(xValue);
        return slope * logXValue + intercept;
    }

    // Example usage to find y value for a given x value
    const xValue = (time_of_production + 1)/ 1 ;  
    const yValue = findYForX(xValue, slope, intercept);
    console.log('Y value:',yValue);

    // Calculate permeability
    const permeability = (162.2 * Calculation_data_array[0].Flow_rate * Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);
    
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare
))
// 7.85
    const PressureSlopeSkinFactor = (yValue - Calculation_data_array[0].Initial_Pressure)/absoluteSlope

    // console.log(LogPartSkinFactor);
    console.log("LogPartSkinFactor: ",LogPartSkinFactor);
    // console.log(Calculation_data_array[0].Initial_Pressure);
    // console.log(yValue);
    // console.log(slope);



    // calculate skinFactor
    const skinFactor = 1.1513 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.2275)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log("skin: ", decimaledskinFactor);

Semi_LogGraph(v, w, absoluteSlope, newIntercept, selectedX, selectedY)

function Semi_LogGraph(time, Pressure_, slope, intercept, selectedX, selectedY) {
    // Line chart (Start)
    const x = time;
    const y = Pressure_;
    const slope_ = slope;
    const intercept_ = intercept;
    const yValueForSL = selectedY
    const xValueForSL = selectedX



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

    // Set up the x and y scales
    const maxX = d3.max(x);
    const xScale = d3.scaleLog()
        .domain([1, Math.pow(10, Math.ceil(Math.log10(maxX)))])
        .range([width, 0]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(y), d3.max(y)])
        .range([height, 0]);

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    // Prepare the data
    const data_ = x.map((d, i) => ({x: d, y: y[i]}));

    console.log(data_)

    // Add the line path
    svg.append("path")
        .datum(data_)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Plot data points
    svg.selectAll("circle")
        .data(data_)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(10, ",.1s"));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat("")
        );

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat("")
        );

// Create straightline to be superimposed
const xForStraighline = [xValueForSL[xValueForSL.length - 1], 1] //X-value chosen are 1. the last value of the selectedX value and 1 (where we have the intercept)
const yForStraighline = [yValueForSL[yValueForSL.length - 1], intercept_]
// Y-value chosen are 1. the last value of the selectedY value and the intercept

    // Create straight line data points
    const regLineData = xForStraighline.map((d, i) => ({x: d, y: yForStraighline[i]}));

    // console.log("Regression line data",regLineData);

    // Add straight line on the same chart
    svg.append("path")
        .datum(regLineData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
        );

}
//Line chart end

// Write the calculation steps

// To show calculation steps
const slopeY2 =  (n * sumXY);
const slopeY1 =  (sumX * sumY);

const slopeX2 =  (n * sumXX);
const slopeX1 =  (sumX * sumX);

const antilog_slopeX2 = Math.pow(10, slopeX2)
const antilog_slopeX1 = Math.pow(10, slopeX1)

console.log("slopeY2: ", slopeY2);

// Can you help generate a equation
document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 
            <p>Our approach is to plot \\( p_{ws} \\) vs. \\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\), identify the position of the middle-time line, and determine whether the late-time data fall on a line with slope double that of the middle-time line. If so, then the straightforward double-slope method can be used to estimate the distance to the boundary. If not, a more complicated calculation is required.</p>

            <p>1. Construct a Horner semilog plot above with the plotting functions given in Table below.</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
            \\]

            \\[
            = \\frac{${slopeY2} - ${slopeY1}}{\\log(${antilog_slopeX2}) - \\log(${antilog_slopeX1})}
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
MathJax.typeset(); // To render the MathJax content.

const extendedhornerArray = addToBeginning(hornerArray, "-")
// Add a new term to the front of the array horner array.
function addToBeginning(hornerArray, newTerm) {
    const newArray = new Array(hornerArray.length + 1);

    // Set the new term at the 0 index
    newArray[0] = newTerm;

    // Copy the remaining elements from the original array to the new array
    for (let i = 0; i < hornerArray.length; i++) {
        newArray[i + 1] = hornerArray[i];
    }

    return newArray;
}

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        time.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = Pressure_[index];
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = extendedhornerArray[index];
            row.appendChild(cell3);
            
            tableBody.appendChild(row);
        });
    }

function buildupPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2
    let time_of_production = Calculation_data_array[0].Production_time;

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

    const reversedHorner_array = hornerArray.reverse()
    const reversedpressure_array = pressure_array.reverse()
    // console.log(reversedHorner_array);
    // console.log(reversedpressure_array);

 


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
        const x = reversedHorner_array.slice(0, -1);
        const y = reversedpressure_array.slice(0, -1);

        console.log(x);
        console.log(y);

        const v = x.slice().reverse();
        const w = y.slice().reverse();

        console.log("v and w below");
        console.log(v);
        console.log(w);



        // Select the range of points that form the straight line (radial flow zone)
        const startIndex = 5;  // Start index of the straight line section
        const endIndex = 12;    // End index of the straight line section

        const selectedX = x.slice(startIndex, endIndex + 1);
        const selectedY = y.slice(startIndex, endIndex + 1);

        console.log("SelectedX: ",selectedX);

        // Change selected x-axis values to their logarithmic values (base 10)
        const log_X = selectedX.map(value => Math.log10(value));

        // Perform linear regression on the selected x-values and y-values
        const { slope, intercept, n, sumXY, sumX, sumY, sumXX} = linearRegression(log_X, selectedY);

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
        const logXValue = Math.log10(xValue);
        return slope * logXValue + intercept;
    }

    // Example usage to find y value for a given x value
    const xValue = (time_of_production + 1)/ 1 ;  
    const yValue = findYForX(xValue, slope, intercept);
    console.log('Y value:',yValue);

    // Calculate permeability
    const permeability = (162.2 * Calculation_data_array[0].Flow_rate * Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(2)
    console.log("permeability: ",decimaledPermeability);
    
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare
))
// 7.85
    const PressureSlopeSkinFactor = (yValue - Calculation_data_array[0].Initial_Pressure)/absoluteSlope

    // console.log(LogPartSkinFactor);
    console.log("LogPartSkinFactor: ",LogPartSkinFactor);
    // console.log(Calculation_data_array[0].Initial_Pressure);
    // console.log(yValue);
    // console.log(slope);



    // calculate skinFactor
    const skinFactor = 1.1513 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.2275)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log("skin: ", decimaledskinFactor);

Semi_LogGraph(v, w, absoluteSlope, newIntercept, selectedX, selectedY)

function Semi_LogGraph(time, Pressure_, slope, intercept, selectedX, selectedY) {
    // Line chart (Start)
    const x = time;
    const y = Pressure_;
    const slope_ = slope;
    const intercept_ = intercept;
    const yValueForSL = selectedY
    const xValueForSL = selectedX



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

    // Set up the x and y scales
    const maxX = d3.max(x);
    const xScale = d3.scaleLog()
        .domain([1, Math.pow(10, Math.ceil(Math.log10(maxX)))])
        .range([width, 0]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(y), d3.max(y)])
        .range([height, 0]);

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    // Prepare the data
    const data_ = x.map((d, i) => ({x: d, y: y[i]}));

    console.log(data_)

    // Add the line path
    svg.append("path")
        .datum(data_)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Plot data points
    svg.selectAll("circle")
        .data(data_)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 3);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(10, ",.1s"));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat("")
        );

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat("")
        );

// Create straightline to be superimposed
const xForStraighline = [xValueForSL[xValueForSL.length - 1], 1] //X-value chosen are 1. the last value of the selectedX value and 1 (where we have the intercept)
const yForStraighline = [yValueForSL[yValueForSL.length - 1], intercept_]
// Y-value chosen are 1. the last value of the selectedY value and the intercept

    // Create straight line data points
    const regLineData = xForStraighline.map((d, i) => ({x: d, y: yForStraighline[i]}));

    // console.log("Regression line data",regLineData);

    // Add straight line on the same chart
    svg.append("path")
        .datum(regLineData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
        );

}
//Line chart end

// Write the calculation steps

// To show calculation steps
const slopeY2 =  (n * sumXY);
const slopeY1 =  (sumX * sumY);

const slopeX2 =  (n * sumXX);
const slopeX1 =  (sumX * sumX);

const antilog_slopeX2 = Math.pow(10, slopeX2)
const antilog_slopeX1 = Math.pow(10, slopeX1)

console.log("slopeY2: ", slopeY2);

// Can you help generate a equation
document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 
            <p>Our approach is to plot \\( p_{ws} \\) vs. \\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\), identify the position of the middle-time line, and determine whether the late-time data fall on a line with slope double that of the middle-time line. If so, then the straightforward double-slope method can be used to estimate the distance to the boundary. If not, a more complicated calculation is required.</p>

            <p>1. Construct a Horner semilog plot above with the plotting functions given in Table below.</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
            m = \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)}
            \\]

            \\[
            = \\frac{${slopeY2} - ${slopeY1}}{\\log(${antilog_slopeX2}) - \\log(${antilog_slopeX1})}
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
MathJax.typeset(); // To render the MathJax content.

const extendedhornerArray = addToBeginning(hornerArray, "-")
// Add a new term to the front of the array horner array.
function addToBeginning(hornerArray, newTerm) {
    const newArray = new Array(hornerArray.length + 1);

    // Set the new term at the 0 index
    newArray[0] = newTerm;

    // Copy the remaining elements from the original array to the new array
    for (let i = 0; i < hornerArray.length; i++) {
        newArray[i + 1] = hornerArray[i];
    }

    return newArray;
}

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        time.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = Pressure_[index];
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = extendedhornerArray[index];
            row.appendChild(cell3);
            
            tableBody.appendChild(row);
        });
    }


};
    reader.readAsArrayBuffer(file);
};

document.getElementById('fileInput').addEventListener('change', handleFileInput);
    


