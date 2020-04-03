import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Redirect } from 'react-router';
import Error from './Error';

class Logout extends Component {

  static contextType = AuthContext

  state={
    is_logged_out: false,
    error: null,
  }

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
            user: null,
          })

          this.setState({is_logged_out: true});
        }
      })
      .catch((error) => {
        if(error.response) {
          this.setState({
            error: {
              status: error.response.status + ' ' + error.response.statusText,
              detail: error.response.data.detail,
            }
          });
        }
      });
  }

  render() {
    if (this.state.is_logged_out) {
      return (<Redirect to ="/login" />)
    }
    if (this.state.error) {
      return (<Error status={this.state.error.status} detail={this.state.error.detail}/>);
    }
    return (
      null
    );
  }
}

export default Logout;
