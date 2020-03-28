import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router';
import {
  NavLink
} from "react-router-dom";

import { AuthContext } from './AuthProvider';
import ItemPreview from "./item/ItemPreview";

class Profile extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      username: '',
      steamid: '',
      date_joined: '',
      items_to_buy: [],
      items_to_sell: [],
      response_description: '',
      redirect_to_update: false,
      redirect_after_delete: false
    };

    this.delete = this.delete.bind(this);
  }

  delete(){

    let authed_user_id = sessionStorage.getItem('authed_user_id');

    console.log(this.context.getUser());

    axios({
      method: 'delete',
      url: '/users/' + authed_user_id,
    }).then((response) => {
      if(response.status === 200) {
        this.context.setLoginInfo(
          {
            isAuthenticated: false,
            user: null,
            token: null
          });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('authed_user_id');

        $('#deleteModal').modal('hide');
        this.setState({redirect_after_delete: true});
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  componentDidMount() {
    let user_id = sessionStorage.getItem('user_id');
    let authed_user_id = sessionStorage.getItem('authed_user_id');

    axios({
      method: 'get',
      url: '/users/' + user_id,
    }).then((response) => {
      if(response.status === 200) {
        if(authed_user_id !== null && authed_user_id == response.data.user_info.id) {
          this.setState({
            email: response.data.user_info.email,
          });
        }

        this.setState({
          username: response.data.user_info.username,
          steamid: response.data.user_info.steamid,
          date_joined: response.data.user_info.date_joined,
          items_to_buy: response.data.user_info.items_to_buy,
          items_to_sell: response.data.user_info.items_to_sell,
        });
      }
    });
  }

  render() {
    if (this.state.redirect_to_update){
      return (<Redirect to ='/profile/update' />);
    }
    if (this.state.redirect_after_delete){
      return (<Redirect to ='/login' />);
    }
    return (
      <div className="container text-light mt-5">
        {this.context.getIsAuthenticated() &&
          <div>
            {sessionStorage.getItem('user_id') === null &&
              <div>
                {sessionStorage.setItem('user_id', this.context.getUser().id)}
              </div>
            }
          </div>
        }
        <div className="csruby-bg-darkest text-center">
          <h1 className="py-5 mb-0">{this.state.username}</h1>
        </div>

        <table className="table table-dark">
          <tbody>
            {this.state.email
              ? <tr>
                  <th scope="row" className="align-middle">Email</th>
                  <td className="align-middle">
                    <p className="m-0">{this.state.email}</p>
                  </td>
                </tr>
              : null
            }
            <tr>
              <th scope="row">Steam profile</th>
              <td>{this.state.steamid ? <a href={'https://steamcommunity.com/' + this.state.steamid}>Steam profile</a> : 'None'}</td>
            </tr>
            <tr>
              <th scope="row">Joined on</th>
              <td>{new Date(this.state.date_joined).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="modal fade" id="deleteModal" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content text-light csruby-bg-darkest">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Delete profile</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your profile ?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn csruby-bg-red" onClick={this.delete}>Yes</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        {
          this.context.getIsAuthenticated() && this.state.email === this.context.getEmail() &&
        <div className="row mb-3 py-2">
          <div className="col-6">
            <button id="update" type="button" className="item-action btn btn-lg btn-block csruby-bg-red" onClick={() => this.setState({ redirect_to_update: true})}>Update Profile</button>
          </div>
          <div className="col-6">
            <button id="delete" type="button" className="item-action btn btn-lg btn-block csruby-bg-red" data-toggle="modal" data-target="#deleteModal">Delete Profile</button>
          </div>
        </div>
        }
        <div className="csruby-bg-darkest">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active text-danger" id="buying-tab" data-toggle="tab" href="#buying" role="tab" aria-controls="buying" aria-selected="false">Buying</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-danger" id="selling-tab" data-toggle="tab" href="#selling" role="tab" aria-controls="selling" aria-selected="true">Selling</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-danger" id="favorite-tab" data-toggle="tab" href="#favorite" role="tab" aria-controls="favorite" aria-selected="false">Favorite</a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="buying" role="tabpanel" aria-labelledby="buying-tab">
              {this.state.items_to_buy &&
                this.state.items_to_buy.map((item) => {
                  return(
                    <ItemPreview key={item.item_id} itemId={item.item_id} url={item.item_image} name={item.name} rarity_class={item.rarity}/>
                  )
                })
              }
            </div>
            <div className="tab-pane fade" id="selling" role="tabpanel" aria-labelledby="selling-tab">
              {this.state.items_to_sell &&
                this.state.items_to_sell.map((item) => {
                  return(
                    <ItemPreview key={item.item_id} itemId={item.item_id} url={item.item_image} name={item.name} rarity_class={item.rarity}/>
                  )
                })
              }
            </div>
            <div className="tab-pane fade" id="favorite" role="tabpanel" aria-labelledby="favorite-tab">...</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
