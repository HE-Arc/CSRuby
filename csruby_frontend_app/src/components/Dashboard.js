import React, { Component } from 'react';
import axios from 'axios';

import { MContext } from './Provider';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_name: '',
      item_rarity: '',
      item_lowest_price: '',
      item_median_price: '',
      rarity_class: '',
    }
  }

  componentDidMount() {
    let item_prices = [];
    let labels = [];

    axios({
      url:'/items/getMostExpensive',
      method:'get'
    })
    .then((response) => {
      if(response.status === 200) {

        if
        response.data = response.data[0];

        response.data['lowest_prices'].forEach((element) => {
          item_prices.push(parseFloat(element['lowest_price']));
        });

        let rarity_class = 'csruby-rarity-' + response.data['rarity'];

        this.setState((state) =>  {
          return {
            item_name: response.data['name'],
            item_rarity: response.data['rarity'],
            item_lowest_price: response.data['lowest_price'],
            item_median_price: response.data['median_prices'][response.data['median_prices'].length - 1]['median_price'],
            rarity_class: rarity_class,
          };
        });

        response.data['timestamps'].forEach((element) => {
          let date_time = element['timestamp'];
          date_time = date_time.split('T')
          labels.push(String(date_time[0]));
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
              data: item_prices
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
      }
    });
  }

  render() {
    return (
      <div className="content text-light mt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg p-3">
              <div className="csruby-bg-darkest text-center p-3">
                <img src="/static/csruby_frontend_app/images/m4a4_howl.png" className="img-fluid text-center" alt="Responsive image" />
              </div>
              <div className="row mt-3 py-3">
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
              <div className="csruby-bg-darkest csruby-height-100 p-3">
                <canvas id="myChart" width="540" height="450"></canvas>
              </div>
            </div>
          </div>
          <div id="itemInformation" className="csruby-bg-darkest p-3">
            <h4 className={this.state.rarity_class}>{this.state.item_name}</h4>
            <p className="lead">Lowest price : ${this.state.item_lowest_price}</p>
            <p className="lead">Median price : ${this.state.item_median_price}</p>
          </div>
          <MContext.Consumer>
            {(context) => (
              <button onClick={()=>{context.setMessage("New Arrival")}}>Send</button>
            )}
          </MContext.Consumer>
          <h2>Buyers | Sellers</h2>
        </div>
      </div>
    );
  }
}

export default Dashboard;
