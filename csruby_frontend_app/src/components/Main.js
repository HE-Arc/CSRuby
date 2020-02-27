
/******************************************************************************************
* This file serves as the app frame of the SPA, meaning some elemnts never changes
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
// when a link is clicked, a CSS class is automatically added to the element nammed 'active'
// import "../static/csruby_frontend_app/css/main.css";

class Main extends Component {
  render() {
    return (
      // The HashRouter component provides the foundation for the navigation and browser history handling that routing is made up of
      <HashRouter>
        <div>
          <header>
            <h2>CSRuby</h2>
            <NavLink exact to="/">dashboard</NavLink>
          </header>
          <div className="content">
            <Route exact path="/" component={Dashboard}/>
          </div>
        </div>
      </HashRouter>

      // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
      // without the 'exact', the content of home would always be displayed

      // NavLink is
    )
  }
}

export default Main;
