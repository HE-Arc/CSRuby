
/******************************************************************************************
* This file serves as the app frame of the SPA, meaning some elements never changes
* - In this case, the element is
*   - Header (usually the case)
*******************************************************************************************/
import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
  Switch,
} from 'react-router-dom';

import Dashboard from './Dashboard';

import Profile from './Profile';
import UpdateUser from './UpdateUser';

import Search from './Search';
import ResetPassword from './ResetPassword'

import Login from './Login';
import Signup from './Signup';
import Logout from './Logout';

import AuthProvider from './AuthProvider';
import {AuthContext} from './AuthProvider';
import MessageProvider from './MessageProvider';

import Error from './Error';

// when a link is clicked, a CSS class is automatically added to the element nammed 'active'

class Main extends Component {
  render() {
    // The HashRouter component provides the foundation for the navigation and browser history handling that routing is made up of
    return (
      <HashRouter>
        <AuthProvider>
          <MessageProvider>
            <header>
              <nav className="navbar navbar-expand-lg navbar-dark csruby-bg-darkest">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                      <NavLink className="nav-link text-danger" exact to="/search"><i className="fas fa-search"></i> Search</NavLink>
                    </li>
                  </ul>
                  <div className="navbar-brand d-none d-lg-block">
                    <NavLink className="csruby-logo" exact to="/">
                      <img className="csruby-logo-img" src="/static/csruby_frontend_app/logo/csruby_logo.png" alt="csruby_logo"/>
                    </NavLink>
                    <div className="csruby-logo-border"></div>
                    <div className="csruby-logo-border-red"></div>
                  </div>
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated()
                          ? <NavLink className="nav-link text-danger" exact to="/myprofile" onClick={() => sessionStorage.setItem('user', context.getUser().id)}>
                          {context.getUsername()}</NavLink>
                          : <NavLink className="nav-link text-danger" exact to="/login"><i className="fas fa-sign-in-alt"></i> Login</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                    <li className="nav-item active">
                      <AuthContext.Consumer>
                      {(context) =>
                        (context.getIsAuthenticated() &&
                          <NavLink className="nav-link text-danger" exact to="/logout"><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
                        )
                      }
                      </AuthContext.Consumer>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className="csruby-nav-underline csruby-bg-red">
              </div>
            </header>
            <div className="content text-light mt-5">
              <Switch>
                <Route exact path="/" component={Dashboard}/>

                <Route exact path="/myprofile" component={Profile}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/profile/update" component={UpdateUser}/>
                <Route exact path="/search" component={Search}/>

                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" component={Signup}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>

                <Route exact render={(props) => <Error {...props} status={'404 Not Found'} detail={'Requested page not found.'}/> }/>
              </Switch>
            </div>
            <footer className="csruby-bg-darkest text-white py-4 mt-5">
              <div className="container">
                <div className="row">
                  <div className="col-lg">
                    <h5 className="my-3">Information</h5>
                    <p className="text-muted">Hello, welcome to CSRuby ! If you found this site, it likely means that you're interested in CSGO (Counter Strike Global Offensive) or the steam market. Before you dive in, we want to specify that CSRuby is a site that allows users to follow CSGO item's market prices. CSRuby does <strong><u>not</u></strong>, in any circumstances, allow users to purchase or buy items through the website by any means, it merely provides an interface in which the user can search up items and view their current price or price history. However, it allows the user to place virtual buy and sell orders in which then others can make contact with them and proceed to exchange the item via the steam application. This website does <strong><u>not</u></strong>, in any way, support gambling or similar activities.</p>
                    <h5 className="my-3">Social networks</h5>
                    <p className="text-muted">Like what we do ? Then you can follow us on twitter or instagram for updates and other informations !</p>
                    <a className="text-danger" href="#"><i className="fab fa-twitter fa-lg mx-2"></i></a>
                    <a className="text-danger" href="#"><i className="fab fa-instagram fa-lg mx-2"></i></a>
                    <h5 className="my-3">&nbsp;</h5>
                    <p className="text-lg-right">&copy; 2020 CSRuby</p>
                  </div>
                </div>
              </div>
            </footer>
          </MessageProvider>
        </AuthProvider>
      </HashRouter>
    );
    // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
    // without the 'exact', the content of home would always be displayed
  }
}

export default Main;
