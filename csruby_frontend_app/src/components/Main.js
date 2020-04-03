
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
            <div>
              <header>
                <nav className="navbar navbar-expand-lg navbar-dark csruby-bg-red">
                  <NavLink className="navbar-brand" exact to="/">CSRuby<span className="sr-only">(current)</span></NavLink>
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item active">
                        <NavLink className="nav-link" exact to="/search">Search</NavLink>
                      </li>
                    </ul>
                    <ul className="navbar-nav">
                      <li className="nav-item active">
                        <AuthContext.Consumer>
                        {(context) =>
                          (context.getIsAuthenticated()
                            ? <NavLink className="nav-link" exact to="/myprofile" onClick={() => sessionStorage.setItem('user', context.getUser().id)}>
                            {context.getUsername()}</NavLink>
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

                  <Route exact render={(props) => <Error {...props} status={'404 Not Found'} detail={'Requested page not found'}/> }/>
                </Switch>
              </div>
            </div>
          </MessageProvider>
        </AuthProvider>
      </HashRouter>
    );
    // This prop ('exact') ensures the Route is active only if the path is an exact match for what is being loaded
    // without the 'exact', the content of home would always be displayed
  }
}

export default Main;
