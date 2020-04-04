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
      is_reset: false,
      has_error: false,
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

    axios({
      method: 'patch',
      url: '/auth/resetPassword',
      data: userFormData,
    })
    .then((response) => {
      this.setState({ is_reset: true });
    })
    .catch((error) => {
      this.setState({ has_error: true });
    }
  );
}

render() {
  if (this.state.is_authenticated) {
    return (<Redirect to ="/" />);
  }
  return (
    <div className="container pt-4">
      <div className="csruby-bg-darkest p-3">
      {this.state.is_reset &&
        <div>
          <h1>Password reseted</h1>
          <p>If the email you provided is linked to an account, you will soon recieve an email containing your new password.</p>
          <p>Once you recieve the email and <Link to="/login">log in</Link>, don't forget to change your password (by updating profile inforamtions).</p>
        </div>}
      {this.state.has_error &&
        <div>
        <h1>Error while sending mail</h1>
        <p>We encountered an error while sending you the email. Please try again later.</p>
        </div>}
      {!this.state.is_reset && !this.state.has_error &&
      <div>
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
            <button type="submit" className="btn btn-danger">Reset password</button>
          </div>
        </form>
        </div>}
      </div>
    </div>
    );
  }
}

export default ResetPassword;
