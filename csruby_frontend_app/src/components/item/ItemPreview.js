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
      price: props.price,
      rarity_class: 'csruby-rarity-' + props.rarity_class,
    };
  }

  render() {
    return (
      <div className="card csruby-card-shadow csruby-bg-darkest mb-3">
        <div className="row no-gutters">
          <div className="col-md-2 text-center">
            <img className="card-img img-fluid csruby-item-search-img mt-2" src={this.state.url} alt={this.state.name}/>
          </div>
          <div className="col-md-10">
            <div className="card-body d-none d-lg-block">
              <MContext.Consumer>
                {(context) => (
                  <NavLink className={'nav-link p-0 stretched-link csruby-hover-link ' + this.state.rarity_class} exact to="/" onClick={() => {
                      context.setMessage(this.state.itemId)
                    }}>
                    <h5>{this.state.name}</h5>
                  </NavLink>
                )}
              </MContext.Consumer>
              <p className="card-text">Selling price {this.state.price}$</p>
            </div>
            <div className="card-body d-lg-none">
              <MContext.Consumer>
                {(context) => (
                  <NavLink className={'nav-link p-0 stretched-link csruby-hover-link ' + this.state.rarity_class} exact to="/" onClick={() => {
                      context.setMessage(this.state.itemId)
                    }}>
                    <h6>{this.state.name}</h6>
                  </NavLink>
                )}
              </MContext.Consumer>
              <p className="card-text">Selling price {this.state.price}$</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ItemPreview;
