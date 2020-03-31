import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { AuthContext } from './AuthProvider';

class UpdateUser extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state={
      username:'',
      password:'',
      confirm_password:'',
      steamid:'',
      is_updated: false,
      errors: {
        username:'',
        steamid:'',
        password: '',
        confirm_password: '',
        other: ''
      }
    };

    this.handle_change = this.handle_change.bind(this);
    this.submit_form = this.submit_form.bind(this);
    this.has_errors = this.has_errors.bind(this);
  };

  componentDidMount() {
    let user = this.context.getUser();

    this.setState({
      username: user.username,
      steamid: user.steamid === null ? '' : user.steamid,
    })
  }

  handle_change(event) {
    const name = event.target.name;
    const value = event.target.value;

    var errors = {...this.state.errors}

    switch(name){
      case 'username':
        if(value.length < 4){
          errors.username = 'The username is too small!';
        }
        else {
          errors.username = '';
        }
        break;
      case 'password':
        if(value.length != 0 && value.length < 8){
          errors.password = 'The password is too small!';
        }
        else{
          if(this.state.confirm_password.length > 0 && value != this.state.confirm_password){
            errors.confirm_password = 'This password doesn\'t match!';
          }
          else{
            errors.confirm_password = '';
          }
          errors.password = '';
        }
        break;
      case 'confirm_password':
        if(value != this.state.password){
          errors.confirm_password = 'This password doesn\'t match!'
        }
        else{
          errors.confirm_password = '';
        }
        break;

      case 'steamid':
        if(!(/^\d*$/.test(value))){
          errors.steamid = 'The id can only have numbers!'
        }
        else{
          errors.steamid = '';
        }
      default: break;
    }
    this.setState({
    [name]: value,
    errors
   });
  }

  submit_form(event) {
    event.preventDefault();

    let authed_user_id = sessionStorage.getItem('authed_user');

    let userFormData = new FormData();
    userFormData.append('username', this.state.username);
    userFormData.append('password', this.state.password);
    userFormData.append('steamid', this.state.steamid);

    axios({
      method: 'patch',
      url: '/users/' + authed_user_id,
      data: userFormData,
    })
    .then((response) => {
      if(response.status === 200) {
        sessionStorage.setItem('username', response.data.user.username);
        this.context.setUser(response.data.user);

        this.setState({ is_updated: true});
      }
    })
    .catch((error) => {
      if (error.response) {
        var errors = {...this.state.errors}

        errors.other = error.response.data;
        this.setState({errors});
      }
    })
  }

  has_errors(){
    let has_error = false;
    let errors = this.state.errors;
    for (var error in this.state.errors) {
      if(errors[error].length > 0) {
        has_error = true;
      }
    }

    return has_error;
  }
  render() {
    if (this.state.is_updated) {
      return (<Redirect to ="/profile" />)
    }
    return (
      <div className="content">
        <div className="container text-light mt-5">
          <div className="csruby-bg-darkest p-3">
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
                />
                {this.state.errors.username.length > 0 &&
                  <span className='error'>{this.state.errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="steamid">Steam id</label>
                <input
                  type="text"
                  className="form-control"
                  name="steamid"
                  placeholder="Enter Steamid"
                  value={this.state.steamid}
                  onChange={this.handle_change}
                />
                {this.state.errors.steamid.length > 0 &&
                  <span className='error'>{this.state.errors.steamid}</span>}
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
                />
                {this.state.errors.confirm_password.length > 0 &&
                  <span className='error'>{this.state.errors.confirm_password}</span>}
                {this.state.errors.other.length > 0 &&
                  <span className='error'>{this.state.errors.other}</span>}
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
      </div>
    );
  }
}

export default UpdateUser;
