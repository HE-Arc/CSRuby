import React, { Component } from "react";
import { render } from "react-dom";

class ItemPreview extends Component {
  render(){
    return (
      <div>
          <img src="/static/images/stattrack_survival_knife.png" alt="StatTrack Survival Knife"/>
          <h1>★ StatTrak™ Survival Knife | Fade</h1>
          <p>Selling price 1758.58$</p>
      </div>
    );
  }
}

export default ItemPreview;
