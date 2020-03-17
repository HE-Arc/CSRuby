import React, { Component } from "react";
import { render } from "react-dom";
import { MContext } from "../Provider.js";
import { Redirect } from "react-router-dom";

class ItemPreview extends Component {
  constructor(props){
    super(props);
    this.state = {
      itemId: props.itemId,
      url: props.url,
      name: props.name,
      price: props.price
    };
  }

  render() {
    return (
      <div>
          <img src={this.state.url} alt={this.state.name}/>
          <h1>{this.state.name}</h1>
          <p>Selling price {this.state.price}$</p>
          <MContext.Consumer>
            {(context) => (
              <button onClick={() => {
                    context.setMessage(this.state.itemId)
                  }}>Send</button>
            )}
          </MContext.Consumer>
      </div>
    );
  }
}

export default ItemPreview;
