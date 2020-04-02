import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

class ResetPassword extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state={
      email:'',
      is_authenticated: false,
    };

    this.handle_change = this.handle_change.bind(this);
    this.submit_form = this.submit_form.bind(this);
  };

  handle_change(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }


  submit_form(event){
    event.preventDefault();

    let userFormData = new FormData();
    userFormData.append('email', this.state.email);

    //axios.defaults.xsrfCookieName = 'csrftoken';
    //axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    axios({
      method: 'patch',
      url: '/auth/resetPassword',
      data: userFormData,
    })
    .then((response) => {
      if (response.status === 200) {
        return (<Redirect to ="/" />);
      }
    })
    .catch((error) => {
      return (<Redirect to ="/" />);
    }
  );
}

render() {
  if (this.state.is_authenticated) {
    return (<Redirect to ="/" />);
  }
  return (
    <div className="content">
      <div className="container text-light mt-5">
        <div className="csruby-bg-darkest p-3">
        <p>To reset yout password, enter the email address linked to your account in the field below.</p>
          <form onSubmit={this.submit_form}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Enter Email"
                value={this.state.email}
                onChange={this.handle_change}
                required
                />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">Reset password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  }
}

export default ResetPassword;
