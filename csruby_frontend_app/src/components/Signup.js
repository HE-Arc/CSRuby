import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      email:'',
      password:'',
      confirm_password:'',
      is_created: false,
      errors: {
        username:'',
        email: '',
        password: '',
        confirm_password: ''
      }
    };

    this.handle_change = this.handle_change.bind(this);
    this.submit_form = this.submit_form.bind(this);
    this.has_errors = this.has_errors.bind(this);
  };

  handle_change(event){
    const name = event.target.name;
    const value = event.target.value;

    var errors = {...this.state.errors}

    switch(name){
      case "username":
        if(value.length < 4){
          errors.username = "The username is too small!";
        }
        else {
          errors.username = "";
        }
        break;
      case "password":
        if(value.length < 8){
          errors.password = "The password is too small!";
        }
        else{
          if(this.state.confirm_password.length > 0 && value != this.state.confirm_password){
            errors.confirm_password = "This password doesn't match!";
          }
          else{
            errors.confirm_password = "";
            errors.password = "";
          }
        }
        break;
      case "confirm_password":
        if(value != this.state.password){
          errors.confirm_password = "This password doesn't match!"
        }
        else{
          errors.confirm_password = "";
        }
        break;
      case "email":
        errors.email = "";
        break;
      default: break;
    }
    this.setState({
    [name]: value,
    errors
   });

  };

  submit_form(event){
    event.preventDefault();

    var userFormData = new FormData();
    userFormData.append('username', this.state.username);
    userFormData.append('email', this.state.email);
    userFormData.append('password', this.state.password);

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    axios({
      method: 'post',
      url: '/auth/register',
      data: userFormData
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ is_created: true });
        }
      })
      .catch((error) => {
        if (error.response) {
          var errors = {...this.state.errors}

          if("email" in error.response.data){
            errors.email = error.response.data["email"];
            this.setState({errors})
          }
          // console.log(error);
        }
      });
  };

  has_errors(){
    let has_error = false;
    let errors = this.state.errors;
    for (var error in this.state.errors){
      if(errors[error].length > 0){
        has_error = true;
      }
    }

    return has_error;
  }
  render() {
    if (this.state.is_created) {
      return (<Redirect to ="/login" />)
    }
    return (
      <div className="content text-light mt-5">
        <div className="container">
          <form onSubmit={this.submit_form}>
            <div className="form-group">
              <label htmlFor="username">Profile name</label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Enter Profilename"
                value={this.state.username}
                onChange={this.handle_change}
                required
              />
              {this.state.errors.username.length > 0 &&
                <span className='error'>{this.state.errors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handle_change}
                required
              />
              {this.state.errors.email.length > 0 &&
                <span className='error'>{this.state.errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Enter Password"
                value={this.state.password}
                onChange={this.handle_change}
                required
              />
              {this.state.errors.password.length > 0 &&
                <span className='error'>{this.state.errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirm password</label>
              <input
                type="password"
                className="form-control"
                name="confirm_password"
                placeholder="Confirm Password"
                value={this.state.confirm_password}
                onChange={this.handle_change}
                required
              />
              {this.state.errors.confirm_password.length > 0 &&
                <span className='error'>{this.state.errors.confirm_password}</span>}
            </div>
            <div className="form-group">
            {this.has_errors()
                ? <button type="submit" className="btn btn-primary" disabled>Submit</button>
                : <button type="submit" className="btn btn-primary">Submit</button>
              }
            </div>
          </form>
        </div>
      </div>
    )
  };
}

export default Signup;
