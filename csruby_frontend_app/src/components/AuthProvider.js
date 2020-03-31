import React, { Component } from 'react';
import axios from 'axios';

export const AuthContext = React.createContext();

class AuthProvider extends Component {
  constructor(props) {
    super(props)
    this.state={
        is_authenticated: false,
        user: null,
        token: null
      }
  }

  componentDidMount() {
    let token = sessionStorage.getItem('token')
    if(token != null) {
      axios({
        method: 'get',
        url: '/auth/user',
        headers: { 'Authorization': 'Token ' + token },
        })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
                is_authenticated: true,
                user: response.data,
                token: token,
              })
          }
        })
        .catch((error) => {
          if (error.response) {
            this.setState({
                is_authenticated: false,
                user: null,
                token: null,
              })
          }
        });
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.token !== prevState.token) {
      if(this.state.token == null) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('authed_user');
        sessionStorage.removeItem('username');
      } else {
        sessionStorage.setItem('token', this.state.token);
        sessionStorage.setItem('authed_user', this.state.user.id);
        sessionStorage.setItem('username', this.state.user.username);
      }
    }
  }

  render() {
      return (
      <AuthContext.Provider value = {
        { state : this.state,
          setUser: (value) => this.setState({
            user: value
          }),
          setToken: (value) => this.setState({
            token: value
          }),
          setIsAuthenticated: (value) => this.setState({
            is_authenticated: value
          }),
          setLoginInfo: (value) => this.setState({
            is_authenticated: value['is_authenticated'],
            user: value['user'],
            token: value['token'],
          }),
          getUser: () => this.state.user,
          getEmail: () => this.state.user.email,
          getUsername: () => sessionStorage.getItem('username') ? sessionStorage.getItem('username') : this.state.user.username,
          getIsAuthenticated: () => this.state.is_authenticated,
          getToken: () => this.state.token,
      }}>

      {this.props.children}

      </AuthContext.Provider>)
    }
}

export default AuthProvider;
