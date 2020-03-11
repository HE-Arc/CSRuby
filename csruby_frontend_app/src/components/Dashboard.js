import React, { Component } from "react";

class Dashboard extends Component {
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
