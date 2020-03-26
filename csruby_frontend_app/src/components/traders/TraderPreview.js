import React, { Component } from "react";
import { render } from "react-dom";
import { Redirect, NavLink } from "react-router-dom";
import axios from 'axios';

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
      response_description: '',
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
            trade_id: this.state.id,
            action: this.state.action
          }
        })
        .then((response) => {
          if(response.status === 200) {
            if(response.data.status.includes('success') || response.data.status.includes('failed')) {
              this.setState({
                response_description: response.data.description
              });
            }
            $('#itemActionModal').modal('show');
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
            <div className="itemActions">
              <a id={'removeTradeOf' + encodeURI(this.state.username)} href="#" className="btn btn-secondary">Remove</a>
              <div className="modal fade" id="itemActionModal" tabIndex="-1" role="dialog" aria-labelledby="itemActionModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content text-light csruby-bg-darkest">
                    <div className="modal-header">
                      <h5 className="modal-title" id="itemActionModalLabel">Buy Order</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>{this.state.response_description}</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default TraderPreview;
