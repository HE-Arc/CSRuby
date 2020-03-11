import React, { Component } from "react";

class Dashboard extends Component {
  render() {
    return (
      <div class="content text-light mt-5">
        <div class="container">
          <div class="row">
            <div class="col-lg p-3">
              <div class="csruby-bg-darkest text-center">
                <img src="/static/csruby_frontend_app/images/m4a4_howl.png" class="img-fluid text-center" alt="Responsive image" />
              </div>
              <div class="row mt-3">
                <div class="col-4">
                  <button type="button" class="btn btn-lg btn-block csruby-bg-red">Buy</button>
                </div>
                <div class="col-4">
                  <button type="button" class="btn btn-lg btn-block csruby-bg-red">Sell</button>
                </div>
                <div class="col-4">
                  <button type="button" class="btn btn-lg btn-block csruby-bg-red">Favourite</button>
                </div>
              </div>
            </div>
            <div class="col-lg p-3">
              <div class="csruby-bg-darkest csruby-height-100">
                <p>graph</p>
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
