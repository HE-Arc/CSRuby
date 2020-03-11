import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      password:''
    }
  }

  render() {
    return (
      <div>
        <input type="text"
               placeholder="Enter Username"
               onChange = {(event,newValue) => this.setState({username:newValue})}
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
