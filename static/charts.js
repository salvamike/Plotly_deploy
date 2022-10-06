function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      console.log(data)
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var desiredSampleNumber = samples.filter(sampleObj => sampleObj.id == sample);
  
      var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var firstSample = desiredSampleNumber[0];
  
      var result = resultArray[0];
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = firstSample.otu_ids;
  
      var otu_labels = firstSample.otu_labels;
  
      var sample_values = firstSample.sample_values;
  
      var washFrequency = result.wfreq;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otu_ids.slice(0, 10).map(otuId => `OTU: ${otuId}`).reverse()
  
      // Plotly Biodiversity Bar Chart//
      // 8. Create the trace for the bar chart. 
      var barData = [{
        type: 'bar',
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        orientation: 'h',
        text: otu_labels.slice(0, 10).reverse()
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: 'Top 10 Bacteria Cultures per Sample',
        margin: {
          t: 30, l: 150
  
        },
  
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar', barData, barLayout);
  
      // Plotly Biodiversity Bubble Chart//
      // 1. Create the trace for the bubble chart.
      var bubbleData = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "Blues"
        }
      };
  
      // 2. Create the layout for the bubble chart.
      var bubbleDataLayout = {
        title: 'Bacteria Cultures per Sample',
        xaxis: { title: "OTU ID" },
        margin: { t: 50 },
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", [bubbleData], bubbleDataLayout);
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "<b>Bellybutton Washing Frequency</b> <br>Scrubs per Week", font: { size: 24 } },
        gauge: {
          axis: { range: [null, 10], tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "#004eff" },
            { range: [2, 4], color: "#003ecc" },
            { range: [4, 6], color: "#0036b1" },
            { range: [6, 8], color: "#002e9a" },
            { range: [8, 10], color: "#001f66" }
          ],
        }
      }
      ];
  
      // // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        margin: { t: 20, b: 20, l: 20, r: 30, }
  
      };
  
      // // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
    });
  }