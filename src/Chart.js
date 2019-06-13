import React, {Component} from 'react'
import * as d3 from 'd3'

//set up state
class Chart extends Component {
    constructor(){
      super()
      this.state = {
        parsedData : {},
        currency: "CAD",
        base: "USD"
      }
      this.handleChange = this.handleChange.bind(this)
      this.getParseData = this.getParseData.bind(this)
    }

    handleChange(e){
      const {name, value} = e.target;
      this.setState({[name]:value})
    }


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
          // define the area

     var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.value); });

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
          .text(`Price (${this.state.base})`);

      g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "tomato")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", line);

      g.append("path")
          .data([data])
          .attr("fill", "rgba(255, 99, 71, 0.5)")
          .attr("d", area);
    }

    removeGraph(){

        d3.selectAll("path").remove();
        d3.selectAll("g").remove();

    }

  getParseData(){
       this.removeGraph()

    // Load data from API when DOM Content has been loaded
     //let parsedData = {};
      fetch(`https://api.exchangeratesapi.io/history?start_at=2019-04-01&end_at=2019-05-01&base=${this.state.base}&symbols=${this.state.currency}`)
          .then((response)=>{return response.json();})
          .then((data)=>{


              //parsedData = parseData(data);
              //this.drawChart(parsedData);
              //setting state here
              this.setState({
                 parsedData : parseData(data)
              })

              this.drawChart(this.state.parsedData);
         })

          .catch((err)=>{console.log(err);})


        const parseData = (data) => {
              const {rates} = data;

             //let curr1 = Object.keys(rates);

              var arr = [];
              for (var i in rates) {
                //new
                  let currKey = Object.keys(rates[i])[0]
                //new
                  arr.push({
                      date: new Date(i), //this is the date
                      value: rates[i][currKey] // converts the string to a number
                  });
              };
              return arr.sort((a,b)=>{return a.date - b.date});
          }
    /* this is a function to  pars data into key-value pairs
    @para {object} data Object containing historical data for Bitcoin price index (bpi)*/
    //this.drawChart(this.state.parsedData);
  }

  componentDidMount(){
    this.getParseData();
  }


   render(){
     //conditional rendering based on state

     return (<div>
          <svg> </svg>



           <div className="select">
              <label> Currency: </label>
              <select
                value={this.state.currency}
                onChange={this.handleChange}
                name="currency">
                <option value="">--Select --</option>
                <option value="BGN">BGN</option>
                <option value="NZD">NZD</option>
                <option value="RUB">RUB</option>
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="PHP">PHP</option>
                <option value="CHF">CHF</option>
                <option value="ZAR">ZAR</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
                <option value="TRY">TRY</option>
                <option value="HKD">HKD</option>
                <option value="MYR">MYR</option>
                <option value="THB">THB</option>
                <option value="HRK">HRK</option>
                <option value="CZK">CZK</option>
                <option value="IDR">IDR</option>
                <option value="LVL">LVL</option>
                <option value="DKK">DKK</option>
                <option value="NOK">NOK</option>
                <option value="HUF">HUF</option>
                <option value="GBP">GBP</option>
                <option value="MXN">MXN</option>
                <option value="LTL">LTL</option>
                <option value="KRW">KRW</option>
                <option value="SGD">SGD</option>
                <option value="BRL">BRL</option>
                <option value="PLN">PLN</option>
                <option value="INR">INR</option>
                <option value="EEK">EEK</option>
                <option value="RON">RON</option>
                <option value="CNY">CNY</option>
                <option value="SEK">SEK</option>
              </select>
             </div>

             <div className="select">
                <label> Base Currency: </label>
                <select
                  value={this.state.base}
                  onChange={this.handleChange}
                  name="base">
                  <option value="">--Select --</option>
                  <option value="BGN">BGN</option>
                  <option value="NZD">NZD</option>
                  <option value="RUB">RUB</option>
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                  <option value="CHF">CHF</option>
                  <option value="ZAR">ZAR</option>
                  <option value="AUD">AUD</option>
                  <option value="JPY">JPY</option>
                  <option value="TRY">TRY</option>
                  <option value="HKD">HKD</option>
                  <option value="MYR">MYR</option>
                  <option value="THB">THB</option>
                  <option value="HRK">HRK</option>
                  <option value="CZK">CZK</option>
                  <option value="IDR">IDR</option>
                  <option value="LVL">LVL</option>
                  <option value="DKK">DKK</option>
                  <option value="NOK">NOK</option>
                  <option value="HUF">HUF</option>
                  <option value="GBP">GBP</option>
                  <option value="MXN">MXN</option>
                  <option value="LTL">LTL</option>
                  <option value="KRW">KRW</option>
                  <option value="SGD">SGD</option>
                  <option value="BRL">BRL</option>
                  <option value="PLN">PLN</option>
                  <option value="INR">INR</option>
                  <option value="EEK">EEK</option>
                  <option value="RON">RON</option>
                  <option value="CNY">CNY</option>
                  <option value="SEK">SEK</option>
                 </select>
               </div>

             <button className="update" onClick={this.getParseData}>update</button>


     </div>)
   }
}


export default Chart
