// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON Data and console to log it
d3.json(url).then(function(data){
   console.log(data); 
});

//Initialize the dashbord at start up
function init(){


    //Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    //Use D3 to sample names and populate the drop-down selector
    d3.json(url).then((data) =>{
        
        //set a variable for the sample names
        let names = data.names;
        //add samples to dropdown menu
        names.forEach((id) =>{
        // log the value of id for each iteration of the loop
        
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        //let the first sample from the list
        let sample_one = names[0];

        // log the value of sample_one
        console.log(sample_one);

        // build the initial plots

        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};

//function that populates metadata info
function buildMetadata(sample) {

    //use D3 to retrieve all of the data 
    d3.json(url).then((data) => {

        //retrieve all metadata
        let metadata = data.metadata;

        //filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // log the array of metadata objects after the have been filtered
        console.log(value)

        //get the first index from the array
        let valueData = value[0];

        //clear out metadata
        d3.select("#sample-metadata").html("");

        // use object.entries to add each key/values pair to the panel
        Object.entries(valueData).forEach(([key,value]) =>{

            //log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });



    });



};

// Function that builds the bar Chart
function buildBarChart(sample) {
    //use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        //retrieve all sample.data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        //Get the first index from the array
        let valueData = value[0];

        //Get the otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"

        };

        // setup the layout

        let layout = {
            title: "Top 10 OTUs Present"

        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar",[trace], layout)


    });

};

// Function that builds the bubble chart

function buildBubbleChart(sample) {
   
    //use D3 to retrieve all of the data
    d3.json(url).then((data) =>{

        //retrieve all sample.data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        //Get the first index from the array
        let valueData = value[0];

        //Get the otu_ids, labels, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        //log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }

        };

        //Set up the layout

        let layout = {
            title: "Bacteria per Sample",
            hovermode: "Closest",
            xaxis: {title: "OTU ID"}
        };


        //Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble",[trace1], layout)
     });

};

//Function that updates dashboard when sample is change
function optionChange(value)  {

    //Log new value
    console.log(value);

    //Call all functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);

};

// Call the initialize function 
init();