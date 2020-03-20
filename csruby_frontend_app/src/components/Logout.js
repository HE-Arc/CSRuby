import React, { Component } from "react";
import axios from "axios";
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';

class Logout extends Component {

  static contextType = AuthContext

  state={ is_logged_out: false }

  componentDidMount()
  {
    axios({
      method: 'post',
      url: '/auth/logout',
      headers: { 'Authorization': 'Token ' + this.context.getToken() }
      })
      .then((response) => {
        if (response.status === 204) {

          this.context.setLoginInfo({
            isAuthenticated: false,
            token: null,
            user: null
          })

          this.setState({is_logged_out: true});
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  }

  render() {
    if (this.state.is_logged_out) {
      return (<Redirect to ="/login" />)
      }
      return (
      null
    );
  }
}

export default Logout;
