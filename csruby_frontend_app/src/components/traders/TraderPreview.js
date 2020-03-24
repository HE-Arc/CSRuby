import React, { Component } from "react";
import { render } from "react-dom";
import { Redirect, NavLink } from "react-router-dom";

class TraderPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      created_at: props.createdAt,
      action: props.action,
    }
  }

  render() {
    let date = new Date(this.state.created_at).toLocaleDateString();
    return(
      <div className="card csruby-card-shadow csruby-bg-darkest mb-3">
        <div className="card-body">
          <h5 className="card-title">{this.state.username}</h5>
          <p className="card-text mb-0">Is looking to {this.state.action} this item</p>
          <small className="text-muted">Created on {date}</small>
        </div>
      </div>
    );
  }
}

export default TraderPreview;
