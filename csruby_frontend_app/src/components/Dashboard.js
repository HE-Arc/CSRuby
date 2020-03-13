import React, { Component } from "react";

class Dashboard extends Component {
  componentDidMount() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: '# of Votes',
          backgroundColor: 'rgba(255, 0, 0, 1.0)',
          borderColor: 'rgba(255, 0, 0, 1.0)',
          fill: false,
          data: [12, 19, 3, 5, 2, 3, 5]
        }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
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
