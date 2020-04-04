import React, { Component } from 'react';
import { render } from 'react-dom';
import { Redirect, NavLink } from 'react-router-dom';

class Error extends Component {
  render() {
    return(
        <div className="container">
            <div className="text-center">
                <div>
                    <h1 className="csruby-error-title text-danger">Oops!</h1>
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
    );
  }
}

export default Error;
