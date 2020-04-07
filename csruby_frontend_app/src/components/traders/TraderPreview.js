import React, { Component } from 'react';
import { render } from 'react-dom';
import { Redirect, NavLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';

class TraderPreview extends Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state = {
      trade: '',
      user: '',
      email: '',
      username: '',
      created_at: '',
      action: '',
    }

    this.onClickActionPatch = this.onClickActionPatch.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.trade !== this.props.trade) {
      this.setState({
        trade: prevProps.trade,
        user: prevProps.user,
        email: prevProps.email,
        username: prevProps.username,
        created_at: prevProps.created_at,
        action: prevProps.action,
      });
    }
  }

  onClickActionPatch(event) {
    axios({
      method: 'patch',
      url: '/items/action',
      data: {
        action: this.props.action,
        intention: 'remove',
        trade: this.props.trade,
      }
    }).then((response) => {
      if(response.status === 200) {
        if(this.props.action === 'buy') {
          this.props.removeBuyOrder();
        }

        if(this.props.action === 'sell') {
          this.props.removeSellOrder();
        }
      }
    });
  }

  render() {
    let date = new Date(this.props.created_at).toLocaleDateString();
    return(
      <div className="card csruby-card-shadow csruby-bg-darkest mb-3">
        <div className="card-body">
          <NavLink className="nav-link text-light p-0" exact to="/profile" onClick={() => sessionStorage.setItem('user', this.props.user)}><h5 className="card-title">{this.props.username}</h5></NavLink>
          <small className="text-muted">Created on {date}</small>
          <p className="card-text mb-2">Is looking to {this.props.action} this item</p>
          {this.context.getIsAuthenticated() && this.props.email === this.context.getEmail() &&
            <div className="itemActions">
              <button id={'removeTradeOf' + encodeURI(this.props.username)} className="btn btn-secondary" onClick={this.onClickActionPatch}>Remove</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default TraderPreview;
