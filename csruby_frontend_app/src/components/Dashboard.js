import React, { Component } from "react";
import axios from "axios";

class Dashboard extends Component {
  componentDidMount() {
    let weapon_prices = []
    let labels = []

    axios({
      url:'/items/17',
      method:'get'
    })
    .then((response) => {
      if(response.status === 200) {
        console.log(response.data);
        response.data['lowest_prices'].forEach((element) => {
          weapon_prices.push(parseFloat(element['lowest_price']));
        });
        response.data['timestamps'].forEach((element) => {
          let date_time = element['timestamp'];
          date_time = date_time.split('T')
          labels.push(String(date_time[0]));
        });

        Chart.pluginService.register({
          afterUpdate: function (chart) {
            var xScale = chart.scales['x-axis-0'];
            if (xScale.options.ticks.maxTicksLimit) {
              // store the original maxTicksLimit
              xScale.options.ticks._maxTicksLimit = xScale.options.ticks.maxTicksLimit;
              // let chart.js draw the first and last label
              xScale.options.ticks.maxTicksLimit = (xScale.ticks.length % xScale.options.ticks._maxTicksLimit === 0) ? 1 : 2;

              var originalXScaleDraw = xScale.draw
              xScale.draw = function () {
                originalXScaleDraw.apply(this, arguments);

                var xScale = chart.scales['x-axis-0'];
                if (xScale.options.ticks.maxTicksLimit) {
                  var helpers = Chart.helpers;

                  var tickFontColor = helpers.getValueOrDefault(xScale.options.ticks.fontColor, Chart.defaults.global.defaultFontColor);
                  var tickFontSize = helpers.getValueOrDefault(xScale.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
                  var tickFontStyle = helpers.getValueOrDefault(xScale.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
                  var tickFontFamily = helpers.getValueOrDefault(xScale.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
                  var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
                  var tl = xScale.options.gridLines.tickMarkLength;

                  var isRotated = xScale.labelRotation !== 0;
                  var yTickStart = xScale.top;
                  var yTickEnd = xScale.top + tl;
                  var chartArea = chart.chartArea;

                  // use the saved ticks
                  var maxTicks = xScale.options.ticks._maxTicksLimit - 1;
                  var ticksPerVisibleTick = xScale.ticks.length / maxTicks;

                  // chart.js uses an integral skipRatio - this causes all the fractional ticks to be accounted for between the last 2 labels
                  // we use a fractional skipRatio
                  var ticksCovered = 0;
                  helpers.each(xScale.ticks, function (label, index) {
                    if (index < ticksCovered)
                    return;

                    ticksCovered += ticksPerVisibleTick;

                    // chart.js has already drawn these 2
                    if (index === 0 || index === (xScale.ticks.length - 1))
                    return;

                    // copy of chart.js code
                    var xLineValue = this.getPixelForTick(index);
                    var xLabelValue = this.getPixelForTick(index, this.options.gridLines.offsetGridLines);

                    if (this.options.gridLines.display) {
                      this.ctx.lineWidth = this.options.gridLines.lineWidth;
                      this.ctx.strokeStyle = this.options.gridLines.color;

                      xLineValue += helpers.aliasPixel(this.ctx.lineWidth);

                      // Draw the label area
                      this.ctx.beginPath();

                      if (this.options.gridLines.drawTicks) {
                        this.ctx.moveTo(xLineValue, yTickStart);
                        this.ctx.lineTo(xLineValue, yTickEnd);
                      }

                      // Draw the chart area
                      if (this.options.gridLines.drawOnChartArea) {
                        this.ctx.moveTo(xLineValue, chartArea.top);
                        this.ctx.lineTo(xLineValue, chartArea.bottom);
                      }

                      // Need to stroke in the loop because we are potentially changing line widths & colours
                      this.ctx.stroke();
                    }

                    if (this.options.ticks.display) {
                      this.ctx.save();
                      this.ctx.translate(xLabelValue + this.options.ticks.labelOffset, (isRotated) ? this.top + 12 : this.options.position === "top" ? this.bottom - tl : this.top + tl);
                      this.ctx.rotate(helpers.toRadians(this.labelRotation) * -1);
                      this.ctx.font = tickLabelFont;
                      this.ctx.textAlign = (isRotated) ? "right" : "center";
                      this.ctx.textBaseline = (isRotated) ? "middle" : this.options.position === "top" ? "bottom" : "top";
                      this.ctx.fillText(label, 0, 0);
                      this.ctx.restore();
                    }
                  }, xScale);
                }
              };
            }
          },
        });

        var ctx = document.getElementById('myChart').getContext('2d');
        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Price at datetime',
              backgroundColor: 'rgba(255, 0, 0, 1.0)',
              borderColor: 'rgba(255, 0, 0, 1.0)',
              fill: false,
              data: weapon_prices
            }]
          },
          options: {
              scales: {
                  yAxes: [{
                    gridLines: {
                      color: '#d63031'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                  }],
                  xAxes: [{
                    gridLines: {
                      color: '#d63031'
                    }
                  }]
              }
          }
        });

        console.log(weapon_prices);
        console.log(labels);
      }
    });
  }

  render() {
    return (
      <div className="content text-light mt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg p-3">
              <div className="csruby-bg-darkest text-center">
                <img src="/static/csruby_frontend_app/images/m4a4_howl.png" className="img-fluid text-center" alt="Responsive image" />
              </div>
              <div className="row mt-3">
                <div className="col-4">
                  <button type="button" className="btn btn-lg btn-block csruby-bg-red">Buy</button>
                </div>
                <div className="col-4">
                  <button type="button" className="btn btn-lg btn-block csruby-bg-red">Sell</button>
                </div>
                <div className="col-4">
                  <button type="button" className="btn btn-lg btn-block csruby-bg-red">Favourite</button>
                </div>
              </div>
            </div>
            <div className="col-lg p-3">
              <div className="csruby-bg-darkest csruby-height-100">
                <canvas id="myChart" width="540" height="450"></canvas>
              </div>
            </div>
          </div>
          <h2>Item information</h2>
          <h2>Buyers | Sellers</h2>
        </div>
      </div>
    );
  }
}

export default Dashboard;
