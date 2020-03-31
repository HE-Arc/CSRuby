
import React, { Component } from 'react';

export const MContext = React.createContext();

class MessageProvider extends Component {
  constructor(props) {
    super(props)
    this.state = { message: ''}
  }

  render() {
    return (
    <MContext.Provider value = {
      { state : this.state,
        setMessage: (value) => this.setState({
          message: value
        })
    }}>

    {this.props.children}

    </MContext.Provider>)

    // {this.props.children} indicates that the global store is accessible to all the child tags with Provider as Parent
  }
}

export default MessageProvider;
