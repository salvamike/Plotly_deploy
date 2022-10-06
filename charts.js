function init()
{
 d3.json("samples.json").then (data=> {
    
  console.log(data)
    //Build the drop down
    var Subject_Dropdown = d3.select("#selDataset")    
    var SubjID = data['names']
    for (var i in SubjID)
    {
    var sel_option = Subject_Dropdown.append("option").text(SubjID[i])
    sel_option.attr("value", SubjID[i])
    }
    
    // call when selection changes in the multi selection list and the first time page loads
    optionChanged(SubjID[0])

 });
}

 
function optionChanged(Sel_SubjID) {

  d3.json("samples.json").then (data=> {
    
    var metaData = data['metadata']

    var get_sel_samp_record = metaData.filter(sel_sample=>sel_sample.id == Sel_SubjID)[0]
    console.log("this is metedata object", get_sel_samp_record)

    // we will need this variable for gauge
    var get_wfreq = get_sel_samp_record['wfreq']

    // call Gauge function
    dispGauge(get_wfreq);
  

    var Subject_Details = d3.select("#sample-metadata") 

    // it clears the contents for the selection
    Subject_Details.html("")

    // Object is the main object that refers to JS Objects.
    // the following line converts this object into an array of arrays. 
    // each property and its value is converted to one inner array 
    // For example, the metadata object
    // {id: 940, ethnicity: "Caucasian", gender: "F", age: 24, location: "Beaufort/NC", bbtype: "I", wfreq: 2}

    // is converted to this array
    // [["id", 940],["ethnicity", "Caucasian"],["gender", "F"],["age", 24]["location", "Beaufort/NC"],["bbtype", "I"],["wfreq", 2]]

    
    var get_sel_samp_record_arr = Object.entries(get_sel_samp_record)
    //console.log("this is metadata arr", get_sel_samp_record_arr)

    get_sel_samp_record_arr.forEach(([key, value])=>{
    Subject_Details.append("p").text(`${key}: ${value}`)
    })

    var Samples = data['samples']
    var get_OTU = Samples.filter(sel_OTU=>sel_OTU.id == Sel_SubjID)[0]

    // console.log("This IS", get_OTU)
    
    // Bar chart to display the top 10 OTUs found in an individual by their ID
    // the data collected from multiple samples for each id is saved in 3 arrays: 
    // 'otu_ids', 'otu_labels', 'sample_values' 
    // To get top 10, we need to sort the data by sample_values in descending order 
    // and then use slice to get top 10
    // To do the sorting , we need to join the values from matching indices of 3 arrays to an array
    // of objects with key value pair properties
    // Then, sort by sample_values and rearrange into arrays using map method and then plot
    // In this case though , the data is already sorted. So we will slice and reverse

    // Bar Chart
    var top_10_OTU_id        = get_OTU['otu_ids'].slice(0,10).reverse()
    var top_10_OTU_id_lbl    = top_10_OTU_id.map(otu_ID => `OTU ${otu_ID}`)
    var top_10_OTU_labels    = get_OTU['otu_labels'].slice(0,10).reverse()
    var top_10_sample_values = get_OTU['sample_values'].slice(0,10).reverse()
    
    dispBar(top_10_sample_values,top_10_OTU_id_lbl,top_10_OTU_labels,Sel_SubjID)
    

    // Bubble chart
    var otu_id = get_OTU['otu_ids']
    var otu_labels = get_OTU['otu_labels']
    var sample_values = get_OTU['sample_values']

    dispBubbleChart(otu_id,otu_labels,sample_values,Sel_SubjID)


    })
}  



function dispBar(top_10_sample_values,top_10_OTU_id_lbl,top_10_OTU_labels,Sel_SubjID)
    {
    
    var colors = ['#f3a005', '#f4af2b','#f5bd44','#f7cb5b','#f9d871','#fce588', '#fce588', '#fff19f', '#f7ef99','#efed94','#e6eb8e']
    colors = colors.reverse()
    var top_10_OTU_trace =
      {

        x: top_10_sample_values,
        y: top_10_OTU_id_lbl,
        text: top_10_OTU_labels,
        type: "bar",
        orientation: "h",
        marker:{
          color: colors}
        
      }

    var bar_layout = {
      title: `<b>Top 10 OTUs found in Test Subject: </b>${Sel_SubjID}`,
      font:{
        family: 'Raleway, sans-serif'
      },
      showlegend: false,
      xaxis: {
        zeroline: false,
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        tickangle: 360,
        gridwidth: 2
      },
      bargap :0.05
    }  
    // Data array
    top_10_Data = [top_10_OTU_trace]

    // console.log(top_10_Data)

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('bar',top_10_Data, bar_layout)
  }


function dispGauge(wfreq){

  // pie chart is used to create a gauge chart
  var drawGauge = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    // dividing the semi circle to 9 equal parts
    values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      
      colors: ['#a7ca4a', '#b6d357','#c6db65','#d4e473','#e3ed80','#f1f68e', '#ffff9d', '#fcf085', '#f9e16d','white'],  
      labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
      hoverinfo: "label"
    },
    hoverinfo: "skip"
  }

  // origin of the needle . its scatter
  var dot = {
    type: 'scatter',
    x: [0],
    y: [0],
    marker: {
      size: 14,
      color:'black'
    },
    showlegend: false,
    hoverinfo: "skip"
  }


  var degrees = 180-(20 * wfreq); // equal degrees of 20 
  var radius = .5;
  var radians = degrees * Math.PI / 180;
  var aX = 0.025 * Math.cos((radians) * Math.PI / 180);
  var aY = 0.025 * Math.sin((radians) * Math.PI / 180);
  var bX = -0.025 * Math.cos((radians) * Math.PI / 180);
  var bY = -0.025 * Math.sin((radians) * Math.PI / 180);
  var cX = radius * Math.cos(radians);
  var cY = radius * Math.sin(radians);


  // triangle
  var path = 'M ' + aX + ' ' + aY +
            ' L ' + bX + ' ' + bY +
            ' L ' + cX + ' ' + cY +
            ' Z';

  //console.log(path)          

  var gaugeLayout = {
    title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: 'black',
        line: {
          color: 'black'
        }
      }],
    xaxis: {
            range: [-1, 1],
            fixedrange: true,
            showticklabels:false,
            zeroline:false, 
            showgrid: false
          },
    yaxis: {
            range: [-1, 1],
            fixedrange: true,
            showticklabels:false,
            zeroline:false, 
            showgrid: false
          }
  };

  Plotly.newPlot("gauge", [drawGauge, dot], gaugeLayout);
}


function dispBubbleChart(OTU_id,OTU_labels,Samp_values,Sel_SubjID)
    {
      var bubble_trace = {
      x: OTU_id,
      y: Samp_values,
      mode: 'markers',
      text: OTU_labels,
      marker: {
        size : Samp_values,
        color: OTU_id,
        colorscale: "Portland"
      }
    };
    
    var bubble_data = [bubble_trace];
    
    var bubble_layout = {
      title: `<b>ALL OTUs found in Test subject: </b>${Sel_SubjID}`,
      showlegend: false
      
    };
    
    Plotly.newPlot('bubble', bubble_data, bubble_layout);}


init()