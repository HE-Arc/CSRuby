import React, { Component } from "react";
import { render } from "react-dom";

class ItemPreview extends Component {
  constructor(props){
    super(props);
    this.state = {
      url:props.url,
      name:props.name,
      price:props.price
    };
  }
  render(){
    return (
      <div>
          <img src={this.state.url} alt={this.state.name}/>
          <h1>{this.state.name}</h1>
          <p>Selling price {this.state.price}$</p>
      </div>
    );
  }
}

export default ItemPreview;
