
/******************************************************************************************
* This file serves as the app frame of the SPA, meaning some elements never changes
* - In this case, the element is
*   - Header (usually the case)
*******************************************************************************************/
import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import Dashboard from "./Dashboard";

import Profile from "./Profile";
import Search from "./Search";

import Login from "./Login";
import Signup from "./Signup";
import Logout from "./Logout";

import AuthProvider from "./AuthProvider";
import {AuthContext} from "./AuthProvider";
import Provider from "./Provider";

// when a link is clicked, a CSS class is automatically added to the element nammed 'active'

class Main extends Component {
  render() {
    // The HashRouter component provides the foundation for the navigation and browser history handling that routing is made up of
    return (
      <HashRouter>
        <AuthProvider>
          <div>
            <header>
              <nav className="navbar navbar-expand-lg navbar-dark csruby-bg-red">
                <NavLink className="navbar-brand" exact to="/">CSRuby</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                      <NavLink className="nav-link" exact to="/">Dashboard<span className="sr-only">(current)</span></NavLink>
                    </li>
                    <li className="nav-item active">
                      <NavLink className="nav-link" exact to="/search">Search</NavLink>
                    </li>
                  </ul>
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated()
                          ? <NavLink className="nav-link" exact to="/profile">{context.getUsername()}</NavLink>
                          : <NavLink className="nav-link" exact to="/login">Login</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li className="nav-item active">
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() &&
                          <NavLink className="nav-link" exact to="/logout">Logout</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>
            <div className="content text-light mt-5">
              <Provider>
                <Route exact path="/" component={Dashboard}/>

                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/search" component={Search}/>

                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/logout" component={Logout}/>
              </Provider>
            </div>
          </div>
        </AuthProvider>
      </HashRouter>
    );
    // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
    // without the 'exact', the content of home would always be displayed
  }
}

export default Main;
