import React, { Component } from 'react';
import { render } from 'react-dom';
import { Redirect, NavLink } from 'react-router-dom';

class Error extends Component {
  render() {
    return(
      <div className="content mt-5">
          <div className="container mt-5">
              <div className="text-center">
                  <div>
                      <h1 className="csruby-error-title">Oops!</h1>
                      <h2>{this.props.status}</h2>
                      <div>
                          Sorry, an error has occured. {this.props.detail}
                      </div>
                      <div>
                          <NavLink exact to="/">Take me Home</NavLink>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

export default Error;
