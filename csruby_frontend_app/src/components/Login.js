import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      email:'',
      password:''
    }
  }

  render() {
    return (
      <div>
        <input type="text"
               placeholder="Enter Email"
               onChange = {(event,newValue) => this.setState({email:newValue})}
        />
        <br/>
        <input type="text"
               placeholder="Enter Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
        />
        <button type="submit" onClick={(event) => this.handleClick(event)}>Login</button>
      </div>
    );
  }

  handleClick(event){

  }
}

export default Login;
