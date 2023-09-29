//I love meme culture so I changed "stock" to "stonk"

async function main() {
    //define our key and sample websocket request
    const key = "33a4210db8d04daf9e3ed5143978ee47" // this should definitely not be public.
    const sampleURL = `https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=${key}`
    //run our async fetch requests
    const response = await fetch(sampleURL)
    const result = await response.json()
    console.log(result)

    /*copied from assignent page
    let GME = result.GME
    let MSFT = result.MSFT
    let DIS = result.DIS
    let BTNX = result.BTNX

    const stonks = [GME, MSFT, DIS, BTNX];
    */
    //using mock data from mockData.js
    const { GME, MSFT, DIS, BNTX } = mockData;
    //creates an array of those mock stock objects
    const mockStonks = [GME, MSFT, DIS, BNTX];

    //create new Timechart on the HTML document
    const timeChartCanvas = document.querySelector('#time-chart');
    //creates a Chart assigned to that HTML element
    new Chart(timeChartCanvas.getContext('2d'), {
        //define chart type
        type: 'line',
        //payload of data referencing the mockStonks
        data: {
            //reverses the values to display earliest dates first, and maps the dates
            labels: mockStonks[0].values.reverse().map(value => value.datetime),
            //maps the mockStonks data
            datasets: mockStonks.map(stonk => ({
                //matches the meta data for the ticker/symbol
                label: stonk.meta.symbol,
                /*maps within a map for the stock values (must reverse here too!)
                applies another map function to define data to be the "high" value
                which is the data we want to display on our chart
                This is the KEY line, where we zero in on the SPECIFIC data within the 
                retrieved object that we actually want to display in our chart.
                */
                data: stonk.values.reverse().map(value => parseFloat(value.high)),

                //calls our background color functions 
                backgroundColor: getColor(stonk.meta.symbol),
                borderColor: getColor(stonk.meta.symbol),
            }))
        }
    });


    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        //define chart type to be bar
        type: 'bar',
        // send payload of data referencing the mockStonks
        data: {
            //only need one data set to run through.
            //created a mapped array of all the mockStonk symbols
            labels: mockStonks.map(symbol => symbol.meta.symbol),
            //maps the mockStonks to the aesthetic side of 
            datasets: [{
                //simplify our dataset to only have 4 values
                label: 'Highest',
                //uses our custom defined function to return the array of 4 highest values
                data: getHighestValues(mockStonks),
                //aesthetic settings -- create a mapped array for colors
                backgroundColor: mockStonks.map(stonk => getColor(stonk.meta.symbol)),
                borderColor: mockStonks.map(stonk => getColor(stonk.meta.symbol)),
            }]
        }

    });
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        //define chart type to pie
        type: 'pie',
        // send payload of data referencing the mockStonks
        data: {
            //only need one data set to run through.
            //created a mapped array of all the mockStonk symbols
            labels: mockStonks.map(symbol => symbol.meta.symbol),
            //maps the mockStonks to the aesthetic side of 
            datasets: [{
                //simplify our dataset to only have 4 values
                label: 'Averages',
                //uses our custom defined function to return the array of 4 highest values
                data: returnAverageValues(mockStonks),
                //aesthetic settings -- create a mapped array for colors
                backgroundColor: mockStonks.map(stonk => getColor(stonk.meta.symbol)),
                borderColor: mockStonks.map(stonk => getColor(stonk.meta.symbol)),
            }]
        }

    });
}

function getHighestValues(stocks) {
    //two forEach loops for each stock element
    //then each stock element's highest value

    //create an array to hold our max values
    const maxValues = [];
    //itterate through each stock we fed in
    stocks.forEach(stock => {
        //assign a max value
        let myStockMax = 0;
        //for each set of values within each stock
        stock.values.forEach(value => {
            //if the value we itterate on is higher, set it as the new max
            if (parseFloat(value.high) > myStockMax) {
                myStockMax = parseFloat(value.high);
            }
            else {
                //do nothing
            }
        })
        //adds the max value to the array
        maxValues.push(myStockMax);
    });
    //returns the array of max values
    return maxValues;
}

/*ok, so I don't actually know if this is technically a moving average I am calculating
    I am not really a finance guy, but I basically took each day's high and low,
    took the average of those two values to find the "daily average", 
    then divided the sum of those "daily averages" by the number of days tracked
*/
function returnAverageValues(stocks) {
    //define an empty array to retun
    let returnValues = []
    stocks.forEach(stonk => {
        let numValues = 0;
        let runningDailyAverage = 0;
        stonk.values.forEach(value => {
            //increment our number of values
            numValues++
            //take the daily high and low and find the daily average 
            runningDailyAverage += ((parseFloat(value.high) + parseFloat(value.high)) / 2);
        })
        //divide the sum of all daily averages by the number of total values
        //add that value to our array
        returnValues.push(runningDailyAverage / numValues);
    })
    // console.log(returnValues)

    //finally, return those values
    return returnValues;
}

function getColor(stock) {
    if (stock === "GME") {
        return 'rgba(61, 161, 61, 0.7)'
    }
    if (stock === "MSFT") {
        return 'rgba(209, 4, 25, 0.7)'
    }
    if (stock === "DIS") {
        return 'rgba(18, 4, 209, 0.7)'
    }
    if (stock === "BNTX") {
        return 'rgba(166, 43, 158, 0.7)'
    }
}


main()