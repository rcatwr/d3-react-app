import React, {Component} from 'react'
import * as d3 from 'd3'

class BarChart extends Component {

    drawChart(data){
      //first part -- setup the svg canvas -- this is cool -- first creating an object to call on!
      var svgWidth = 600, svgHeight = 400;
      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;

      var svg = d3.select('svg')
          .attr("width", svgWidth)
          .attr("height", svgHeight);

      var g = svg.append('g')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // a scaling utility with chained methods
      const x = d3.scaleTime()
          .rangeRound([0, width])

      const y = d3.scaleLinear()
          .rangeRound([height, 0])

      var line = d3.line()
          .x((d)=> {return x(d.date)})
          .y((d)=> {return y(d.value)});

      x.domain(d3.extent(data,(d)=>{return d.date}));
      y.domain(d3.extent(data, (d)=>{return d.value}));

      g.append('g')
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .select(".domain")
          .remove();


      g.append('g')
          .call(d3.axisLeft(y))
          .append('text')
          .attr('fill', "#000")
          .attr('transform', "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em" )
          .attr("text-anchor", "end")
          .text("Price ($)");

      g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);


    }



  componentDidMount(){

    // Load data from API when DOM Content has been loaded
     let parsedData = {};


      fetch('https://api.exchangeratesapi.io/history?start_at=2019-04-01&end_at=2019-05-01&base=USD')
          .then((response)=>{return response.json();})
          .then((data)=>{
              parsedData = parseData(data);
              this.drawChart(parsedData);
         })

          .catch((err)=>{console.log(err);})

        function parseData(data){
              var arr = [];
              for (var i in data.rates) {
                  arr.push({
                      date: new Date(i), //this is the date
                      value: +data.rates[i].CAD // converts the string to a number
                  });
              };
              return arr.sort((a,b)=>{return a.date - b.date});
          }

    /* this is a function to  pars data into key-value pairs
    @para {object} data Object containing historical data for Bitcoin price index (bpi)*/


  }

   render(){
     return <div>
          <svg></svg>
     </div>
   }
}


export default BarChart
