import React, { Component } from "react";
import axios from "axios";

export const AuthContext = React.createContext();  //exporting context object

class AuthProvider extends Component {
  constructor(props) {
    super(props)
    this.state={
        isAuthenticated: false,
        user: null,
        token: null
      }
  }

  componentDidMount() {
    let token = sessionStorage.getItem("token")
    if(token != null){
      axios({
        method: 'get',
        url: '/auth/user',
        headers: { 'Authorization': 'Token ' + token }
        })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
                isAuthenticated: true,
                user: response.data,
                token: token
              })
          }
        })
        .catch((error) => {
          if (error.response) {
            this.setState({
                isAuthenticated: false,
                user: null,
                token: null
              })
          }
        });
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.token !== prevState.token) {
      if(this.state.token == null){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem('authed_user_id');
      }
      else{
        sessionStorage.setItem("token", this.state.token);
        sessionStorage.setItem('authed_user_id', this.state.user.id);
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
            isAuthenticated: value
          }),
          setLoginInfo: (value) => this.setState({
            isAuthenticated: value['isAuthenticated'],
            user: value['user'],
            token: value['token']
          }),
          getUser: () => this.state.user,
          getEmail: () => this.state.user.email,
          getUsername: () => this.state.user.username,
          getIsAuthenticated: () => this.state.isAuthenticated,
          getToken: () => this.state.token
      }}>

      {this.props.children}

      </AuthContext.Provider>)
    }
}

export default AuthProvider;
