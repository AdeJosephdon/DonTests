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
        // console.log(workbook.SheetNames[0]);

        for (const sheetName of workbook.SheetNames) {
            worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            // console.log(worksheets[sheetName]);
        }

        // console.log(worksheets)

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
        // console.log(Pressure_);
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
        // console.log(time);
        // Function to extract "time" values into a separate array (end)

        // function to extract the various calculation data.
        // console.log(arrayOfObjectsSheet2[0].Flow_rate);

        // Function to calculate the permeability (drawdown)


        // Function to calculate the Skin factor (drawdown)

        // SemiLogGraph(time, Pressure_)

        // function that draws the Cartesian curve
function CartesianGraph(time, Pressure_) {
        // Line chart (Start)
const x = time;
const y = Pressure_;

// Set dimensions and margins for the chart
const margin = {top: 70, right:30, bottom: 40, left: 80};
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top -margin.bottom;


// Append axes to SVG
const svg = d3.select("#chart-container") //we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up the x and y scales
const xScale = d3.scaleLinear()
    .domain([d3.min(x), d3.max(x)])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([d3.min(y), d3.max(y)])
    .range([height, 0]);


// Create line generator
const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

// Prepare the data
const data_ = x.map((d, i) => ({x: d, y: y[i]}));

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
    .call(d3.axisBottom(xScale));

// Add y-axis
svg.append("g")
    .call(d3.axisLeft(yScale));

//Line chart end
}

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
    console.log(reversedHorner_array);


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
        const x = reversedHorner_array.slice(0, -1);
        const y = reversedpressure_array.slice(0, -1);

        // Select the range of points that form the straight line (radial flow zone)
        const startIndex = 0;  // Start index of the straight line section
        const endIndex = 6;    // End index of the straight line section

        const selectedX = x.slice(startIndex, endIndex + 1);
        const selectedY = y.slice(startIndex, endIndex + 1);

        console.log(selectedX);

        // Change selected x-axis values to their logarithmic values (base 10)
        const log_X = selectedX.map(value => Math.log10(value));

        // Perform linear regression on the selected x-values and y-values
        const { slope, intercept } = linearRegression(log_X, selectedY);

        // Function to perform linear regression
        function linearRegression(logX, y) {
            const n = logX.length;
            const sumX = logX.reduce((a, b) => a + b, 0); //https://www.youtube.com/watch?v=g1C40tDP0Bk about the reduce method
            const sumY = y.reduce((a, b) => a + b, 0);
            const sumXY = logX.reduce((sum, xVal, index) => sum + xVal * y[index], 0);
            const sumXX = logX.reduce((sum, xVal) => sum + xVal * xVal, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return { slope, intercept };
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

console.log("skin: ", skinFactor)

    }

};
    reader.readAsArrayBuffer(file);
};

document.getElementById('fileInput').addEventListener('change', handleFileInput);
    


