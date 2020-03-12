import React, { Component } from "react";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state={
      profilename:'',
      email:'',
      password:'',
      confirm_password:''
    }

    this.handle_change = this.handle_change.bind(this)
    this.submit_form = this.submit_form.bind(this)
  };

  handle_change(event){
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
    [name]: value
   });

  };

  submit_form(event){
    // console.log(this.state.profilename);
    // console.log(this.state.email);
    // console.log(this.state.password);
    // console.log(this.state.confirm_password);

    var userFormData = new FormData();
    userFormData.append('profilename', this.state.profilename);
    userFormData.append('email', this.state.email);
    userFormData.append('password', this.state.password);
    userFormData.append('confirm_password', this.state.confirm_password);
    userFormData.append('steamid', '1');

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    axios({
      method: 'post',
      url: '/api/user/',
      data: userFormData
      })
      .then(function(response){
        console.log("ok");
        console.log(response);
      })
      .catch(function(error){
        console.log("error");
        console.log(error);
        console.log(error.response.data);
        event.preventDefault();
      });

      event.preventDefault();

  };

  render() {
    return (
      <form onSubmit={this.submit_form}>
        <div>
          <input
            type="text"
            name="profilename"
            placeholder="Enter Profilename"
            value={this.state.profilename}
            onChange={this.handle_change}
          />
          <br/>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handle_change}
          />
          <br/>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={this.state.password}
            onChange={this.handle_change}
          />
          <br/>
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={this.state.confirm_password}
            onChange={this.handle_change}
          />
          <br/>
          <button
            type="submit"
          >
          Signup
          </button>
        </div>
      </form>
    )
  };
}

export default Signup;
