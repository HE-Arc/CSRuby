import React, { Component } from "react";
import { render } from "react-dom";
import { Redirect, NavLink } from "react-router-dom";

class TraderPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      authed_user: props.authedUser,
      email: props.email,
      username: props.username,
      created_at: props.createdAt,
      action: props.action,
      belongsToAuthedUser: false,
    }
  }

  componentDidMount() {
    if(this.state.authed_user === this.state.email) {
      this.setState({
        belongsToAuthedUser: true
      });
    }

    if(this.state.authed_user === null) {
      this.setState({
        belongsToAuthedUser: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.authed_user === this.state.email) {
      let remove_trade = document.getElementById('removeTradeOf' + encodeURI(this.state.username));
      remove_trade.addEventListener('click', event => {
        event.preventDefault();

        axios({
          method: 'delete',
          url: '/item/deleteTrade',
          data: {
            id: this.state.id
          }
        })
        .then((response) => {
          if(response.status === 200) {
            // TODO: inform user that it has been deleted
          }
        });
      });
    }
  }

  render() {
    let date = new Date(this.state.created_at).toLocaleDateString();
    return(
      <div className="card csruby-card-shadow csruby-bg-darkest mb-3">
        <div className="card-body">
          <h5 className="card-title">{this.state.username}</h5>
          <small className="text-muted">Created on {date}</small>
          <p className="card-text mb-2">Is looking to {this.state.action} this item</p>
          {this.state.belongsToAuthedUser === true &&
            <a id={'removeTradeOf' + encodeURI(this.state.username)} href="#" className="btn btn-secondary">Remove</a>
          }
        </div>
      </div>
    );
  }
}

export default TraderPreview;
