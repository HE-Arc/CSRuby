import React, { Component } from "react";
import { render } from "react-dom";
import { MContext } from "../Provider.js";
import { Redirect, NavLink } from "react-router-dom";

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
          <p>Selling price {this.state.price}$</p>
          <MContext.Consumer>
            {(context) => (
              <NavLink className="nav-link" exact to="/" onClick={() => {
                  context.setMessage(this.state.itemId)
                }}>
                <h3>{this.state.name}</h3>
              </NavLink>
            )}
          </MContext.Consumer>
      </div>
    );
  }
}

export default ItemPreview;
