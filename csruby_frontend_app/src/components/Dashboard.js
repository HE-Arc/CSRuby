import React, { Component } from 'react';
import axios from 'axios';

import {
  NavLink
} from "react-router-dom";

import { MContext } from './Provider';
import { AuthContext } from './AuthProvider';

class Dashboard extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state = {
      item_id: '',
      item_name: '',
      item_rarity: '',
      item_image: '',
      item_lowest_price: '',
      item_median_price: '',
      rarity_class: '',
      isAuthenticated: '',
      user_email: '',
      response_description: '',
    }
  }

  componentDidMount() {
    let item_prices = [];
    let labels = [];

    let url = '/items/getMostExpensive';
    if (this.state.item_id) {
      url = '/items/' + this.state.item_id;
    }

    axios({
      method: 'get',
      url: url
    })
    .then((response) => {
      if(response.status === 200) {

        if(Array.isArray(response.data)) {
          response.data = response.data[0];
        }

        response.data['lowest_prices'].forEach((element) => {
          item_prices.push(parseFloat(element['lowest_price']));
        });

        let rarity_class = 'csruby-rarity-' + response.data['rarity'];

        this.setState({
          item_name: response.data['name'],
          item_rarity: response.data['rarity'],
          item_image: response.data['item_image'],
          item_lowest_price: response.data['lowest_price'],
          item_median_price: response.data['median_prices'][response.data['median_prices'].length - 1]['median_price'],
          rarity_class: rarity_class,
          isAuthenticated: this.context.getIsAuthenticated(),
        });

        if(this.state.isAuthenticated) {
          this.setState({
            user_email: this.context.getEmail()
          });
        }

        let buy_button = document.getElementById('buy');

        let not_logged_link = document.getElementsByClassName('notLoggedLink');

        for (let i = 0; i < not_logged_link.length; i++) {
          not_logged_link[i].addEventListener('click', event => {
            $('#loginWarningModal').modal('hide');
          });
        }

        let item_action_urls = ['/item/buyItem', '/item/sellItem', '/item/favItem'];

        let item_action_buttons = document.getElementsByClassName('item-action');

        for (let i = 0; i < item_action_buttons.length; i++) {
          item_action_buttons[i].addEventListener('click', event => {
            if(!this.state.isAuthenticated) {
              $('#loginWarningModal').modal('show');
            } else {
              axios({
                method: 'post',
                url: item_action_urls[i],
                data: {
                  item_id: response.data['item_id'],
                  authed_user: this.state.user_email,
                  action: item_action_buttons[i].id
                }
              })
              .then((response) => {
                if(response.status === 200) {
                  if(response.data.status.includes('failed')) {
                    this.setState({
                      response_description: response.data.description
                    });
                    $('#buyOrderExists').modal('show');
                  }
                }
              })
            }
          });
        }

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
                  color: '#d63031',
                },
                ticks: {
                  beginAtZero: false,
                  callback: function(value, index, values) {
                    return '$' + value;
                  }
                }
              }],
              xAxes: [{
                gridLines: {
                  color: '#d63031',
                  drawTicks: false
                },
                ticks: {
                  display: false
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Days'
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
      <div className="content">
        <div className="container text-light mt-5">
          <div className="row">
            <div className="col-lg p-3">
              <div className="csruby-bg-darkest text-center p-3">
                <img src={this.state.item_image} className="img-fluid text-center" alt={this.state.item_name} />
              </div>
              <div className="row mt-3 py-3">
                <div className="col-4">
                  <button id="buy" type="button" className="item-action btn btn-lg btn-block csruby-bg-red">Buy</button>
                </div>
                <div className="col-4">
                  <button id="sell" type="button" className="item-action btn btn-lg btn-block csruby-bg-red">Sell</button>
                </div>
                <div className="col-4">
                  <button id="fav" type="button" className="item-action btn btn-lg btn-block csruby-bg-red">Favourite</button>
                </div>
              </div>
            </div>
            <div className="modal fade" id="loginWarningModal" tabIndex="-1" role="dialog" aria-labelledby="loginWarningModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content text-light csruby-bg-darkest">
                  <div className="modal-header">
                    <h5 className="modal-title" id="loginWarningModalLabel">Login first</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>You must be logged in to use this feature !</p>
                    <p>Click <NavLink className="notLoggedLink" exact to="/login">here</NavLink> to login or <NavLink className="notLoggedLink" exact to="/login">here</NavLink> to create an account if you don't have one.</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="buyOrderExists" tabIndex="-1" role="dialog" aria-labelledby="buyOrderExistsLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content text-light csruby-bg-darkest">
                  <div className="modal-header">
                    <h5 className="modal-title" id="buyOrderExistsLabel">Buy Order</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>{this.state.response_description}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
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
          <h2>Buyers | Sellers</h2>
          <MContext.Consumer>
            {(context) => {
              this.state.item_id = context.state.message
            }}
          </MContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Dashboard;
