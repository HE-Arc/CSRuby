import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      email:'',
      password:'',
      confirmPassword:''
    }

    this.handle_change = this.handle_change.bind(this)
    this.log_values = this.log_values.bind(this)
  };

  handle_change(event){
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
    [name]: value
   });

  };

  submitForm(event){
    console.log(this.state.username);
    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.confirmPassword);
  };

  render() {
    return (
      <div>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={this.state.username}
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
          name="confirmPassword"
          placeholder="Confirm Password"
          value={this.state.confirmPassword}
          onChange={this.handle_change}
        />
        <br/>
        <button
          type="submit"
          onClick={this.submitForm}
        >
        Signup
        </button>
      </div>
    )
  };
}

export default Signup;
