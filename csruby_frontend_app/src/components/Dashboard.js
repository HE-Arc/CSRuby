import React, { Component } from 'react';
import axios from 'axios';

import {
  NavLink
} from 'react-router-dom';

import { MContext } from './MessageProvider';
import { AuthContext } from './AuthProvider';
import TraderPreview from './traders/TraderPreview.js';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_id: '',
      item_name: '',
      item_rarity: '',
      item_image: '',
      item_lowest_price: '',
      item_median_price: '',
      buyers: [],
      sellers: [],
      has_placed_buy_order: false,
      has_placed_sell_order: false,
      is_favorite: false,
      row_exists: false,
      empty_buyers: 'd-none',
      empty_sellers: 'd-none',
      rarity_class: '',
      authed_user: '',
      trade: '',
    }

    this.buy_button = null;
    this.sell_button = null;
    this.fav_button = null;

    this.onBuyClickPatch = this.onBuyClickPatch.bind(this);
    this.onBuyClickPost = this.onBuyClickPost.bind(this);
    this.onSellClickPatch = this.onSellClickPatch.bind(this);
    this.onSellClickPost = this.onSellClickPost.bind(this);
    this.onFavClickPatch = this.onFavClickPatch.bind(this);
    this.onFavClickPost = this.onFavClickPost.bind(this);


    this.handleItemAction = this.handleItemAction.bind(this);
    this.fetchItem = this.fetchItem.bind(this);

    this.removeBuyOrder = this.removeBuyOrder.bind(this);
    this.removeSellOrder = this.removeSellOrder.bind(this);

    this.hideModalOnRedirect = this.hideModalOnRedirect.bind(this);
    this.addEventToTradersLinks = this.addEventToTradersLinks.bind(this);
    this.toggleBuyLink = this.toggleBuyLink.bind(this);
    this.toggleSellLink = this.toggleSellLink.bind(this);
  }

  onBuyClickPatch(event) {
    axios({
      method: 'patch',
      url: '/item/action',
      data: {
        action: 'buy',
        intention: 'add',
        trade: this.state.trade,
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          has_placed_buy_order: true
        });
      }
    });
  }

  onSellClickPatch(event) {
    axios({
      method: 'patch',
      url: '/item/action',
      data: {
        action: 'sell',
        intention: 'add',
        trade: this.state.trade,
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          has_placed_sell_order: true
        });
      }
    })
  }

  onFavClickPatch(event) {
    axios({
      method: 'patch',
      url: '/item/action',
      data: {
        action: 'fav',
        intention: this.state.is_favorite ? 'remove' : 'add',
        item_id: sessionStorage.getItem('session_item_id'),
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          is_favorite: response.data.favorite_item,
        });
      }
    });
  }

  onBuyClickPost(event) {
    axios({
      method: 'post',
      url: '/item/action',
      data: {
        action: 'buy',
        item_id: sessionStorage.getItem('session_item_id'),
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          has_placed_buy_order: true
        });
      }
    });
  }

  onSellClickPost(event) {
    axios({
      method: 'post',
      url: '/item/action',
      data: {
        action: 'sell',
        item_id: sessionStorage.getItem('session_item_id'),
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          has_placed_sell_order: true
        });
      }
    });
  }

  onFavClickPost(event) {
    axios({
      method: 'post',
      url: '/item/action',
      data: {
        action: 'fav',
        item_id: sessionStorage.getItem('session_item_id'),
        authed_user: sessionStorage.getItem('authed_user'),
      },
    }).then((response) => {
      if(response.status === 200) {
        this.setState({
          is_favorite: true
        });
      }
    });
  }

  handleItemAction() {
    if(sessionStorage.getItem('authed_user')) {
      let authed_user = sessionStorage.getItem('authed_user');
      let method = 'get';
      let item_id = sessionStorage.getItem('session_item_id');
      let url = '/item/action/' + item_id + '/' + authed_user;

      axios({
        method: method,
        url: url,
      }).then((response) => {
        if(response.status === 200) {
          this.setState({
            has_placed_buy_order: response.data.user_item.buy_item,
            has_placed_sell_order: response.data.user_item.sell_item,
            is_favorite: response.data.user_item.favorite_item,
            row_exists: true,
            trade: response.data.user_item.id,
          });

          this.buy_button.disabled = response.data.user_item.buy_item;
          this.sell_button.disabled = response.data.user_item.sell_item;
        }

        if(response.status === 204) {
          this.setState({
            row_exists: false,
          })
        }
      });
    }
  }

  fetchItem() {
    let session_item_id = sessionStorage.getItem('session_item_id');
    let item_prices = [];
    let labels = [];

    let url = '/item/getMostExpensive';
    if (this.state.item_id) {
      url = '/items/' + this.state.item_id;
    } else if (session_item_id !== null) {
      url = '/items/' + session_item_id;
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

        let rarity_class = 'csruby-rarity-' + response.data.rarity;

        sessionStorage.setItem('session_item_id', response.data.item_id);

        response.data['timestamps'].forEach((element) => {
          let date_time = element['timestamp'];
          date_time = date_time.split('T')
          labels.push(String(date_time[0]));
        });

        this.drawChart(labels, item_prices);

        let empty_buyers = 'd-none';
        let empty_sellers = 'd-none';

        if(response.data.buyers.length == 0) {
          empty_buyers = '';
        }

        if(response.data.sellers.length == 0) {
          empty_sellers = '';
        }

        this.setState({
          item_id: response.data.item_id,
          item_name: response.data.name,
          item_rarity: response.data.rarity,
          item_image: response.data.item_image,
          item_lowest_price: response.data.lowest_price,
          item_median_price: response.data.median_prices[response.data.median_prices.length - 1].median_price,
          buyers: response.data.buyers,
          sellers: response.data.sellers,
          rarity_class: rarity_class,
          empty_buyers: empty_buyers,
          empty_sellers: empty_sellers,
        });

        this.hideModalOnRedirect();
        this.addEventToTradersLinks();
        this.handleItemAction();
      }
    });
  }

  componentDidMount() {
    this.buy_button = document.getElementById('buy');
    this.sell_button = document.getElementById('sell');
    this.fav_button = document.getElementById('fav');

    this.not_logged_link = document.getElementsByClassName('notLoggedLink');
    this.buyers_div = document.getElementById('buyers-div');
    this.sellers_div = document.getElementById('sellers-div');
    this.trader_links = document.getElementsByClassName('traders-link');

    this.fetchItem();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.has_placed_buy_order !== this.state.has_placed_buy_order
      || prevState.has_placed_sell_order !== this.state.has_placed_sell_order) {
        this.fetchItem();
      }
  }

  hideModalOnRedirect() {
    for (let i = 0; i < this.not_logged_link.length; i++) {
      this.not_logged_link[i].addEventListener('click', event => {
        $('#loginWarningModal').modal('hide');
      });
    }
  }

  addEventToTradersLinks() {
    this.trader_links[0].addEventListener('click', event => {
      event.preventDefault();

      this.toggleBuyLink();
    });

    this.trader_links[1].addEventListener('click', event => {
      event.preventDefault();

      this.toggleSellLink();
    });
  }

  toggleBuyLink() {
    this.trader_links[1].classList.remove('text-secondary');
    this.trader_links[1].classList.add('text-light');
    this.trader_links[0].classList.add('text-secondary');
    this.trader_links[0].classList.remove('text-light');

    this.buyers_div.classList.remove('d-none');
    this.sellers_div.classList.add('d-none');
  }

  toggleSellLink() {
    this.trader_links[0].classList.remove('text-secondary');
    this.trader_links[0].classList.add('text-light');
    this.trader_links[1].classList.add('text-secondary');
    this.trader_links[1].classList.remove('text-light');

    this.buyers_div.classList.add('d-none');
    this.sellers_div.classList.remove('d-none');
  }

  drawChart(labels, item_prices) {
    let ctx = document.getElementById('piceChart').getContext('2d');
    let priceLineChart = new Chart(ctx, {
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

  removeBuyOrder(id) {
    this.setState({
      has_placed_buy_order: false
    });
  }

  removeSellOrder(id) {
    this.setState({
      has_placed_sell_order: false
    });
  }

  showLoginWarning() {
    $('#loginWarningModal').modal('show');
  }

  render() {
    return (
      <div className="container text-light mt-5">
        <div className="row">
          <div className="col-lg p-3">
            <div className="csruby-bg-darkest text-center p-3">
              <img src={this.state.item_image} className="img-fluid text-center csruby-item-dashboard-img" alt={this.state.item_name} />
            </div>
            <AuthContext.Consumer>
              {(context) => (
                <div className="row mt-3 py-3">
                  <div className="col-4">
                    <button id="buy" type="button" className="item-action btn btn-lg btn-block csruby-bg-red" onClick={context.getIsAuthenticated() ? (this.state.row_exists ? this.onBuyClickPatch : this.onBuyClickPost) : this.showLoginWarning}>Buy</button>
                  </div>
                  <div className="col-4">
                    <button id="sell" type="button" className="item-action btn btn-lg btn-block csruby-bg-red" onClick={context.getIsAuthenticated() ? (this.state.row_exists ? this.onSellClickPatch : this.onSellClickPost) : this.showLoginWarning}>Sell</button>
                  </div>
                  <div className="col-4">
                    <button id="fav" type="button" className="btn btn-lg btn-block csruby-bg-red" onClick={context.getIsAuthenticated() ? (this.state.row_exists ? this.onFavClickPatch : this.onFavClickPost) : this.showLoginWarning}>{this.state.is_favorite ? 'UnFavorite' : 'Favorite'}</button>
                  </div>
                </div>
              )}
            </AuthContext.Consumer>
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
                  <p>Click <NavLink className="notLoggedLink" exact to="/login">here</NavLink> to login or <NavLink className="notLoggedLink" exact to="/signup">here</NavLink> to create an account if you don't have one.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="tradeModal" tabIndex="-1" role="dialog" aria-labelledby="tradeModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content text-light csruby-bg-darkest">
                <div className="modal-header">
                  <h5 className="modal-title" id="tradeModalLabel">Buy Order</h5>
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
              <canvas id="piceChart" width="540" height="450"></canvas>
            </div>
          </div>
        </div>
        <div id="itemInformation" className="csruby-bg-darkest p-3">
          <h4 className={this.state.rarity_class}>{this.state.item_name}</h4>
          <p className="lead">Selling price : ${this.state.item_lowest_price}</p>
          <p className="lead">Median price : ${this.state.item_median_price}</p>
        </div>
        <h2 className="mt-3"><a className="traders-link text-secondary" href="#">Buyers</a> | <a className="traders-link text-light" href="#">Sellers</a></h2>
        <AuthContext.Consumer>
        {(context) => (
          <div>
            <div id="buyers-div" className="mb-5">
              {this.state.buyers.length > 0 &&
                this.state.buyers.map(item => {
                  return(
                    <TraderPreview key={item.user__username + item.buy_created_at} trade={this.state.trade} user={item.user__id} email={item.user__email} username={item.user__username} created_at={item.buy_created_at} action='buy' removeBuyOrder={this.removeBuyOrder}/>
                  );
                })
              }
              <p className={this.state.empty_buyers + ' lead'}>There doesn't seem to be anyone interested in buying this item...</p>
            </div>
            <div id="sellers-div" className="d-none mb-5">
              {this.state.sellers.length > 0 &&
                this.state.sellers.map(item => {
                  return(
                    <TraderPreview key={item.user__username + item.sell_created_at} trade={this.state.trade} user={item.user__id} email={item.user__email} username={item.user__username} created_at={item.sell_created_at} action='sell' removeSellOrder={this.removeSellOrder}/>
                  );
                })
              }
              <p className={this.state.empty_sellers + ' lead'}>There doesn't seem to be anyone interested in selling this item...</p>
            </div>
          </div>
        )}
        </AuthContext.Consumer>
        <MContext.Consumer>
          {(context) => {
            this.state.item_id = context.state.message
          }}
        </MContext.Consumer>
      </div>
    );
  }
}

export default Dashboard;
