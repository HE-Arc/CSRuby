import React, { Component } from "react";
import axios from 'axios';

import {
  NavLink
} from "react-router-dom";

import { AuthContext } from './AuthProvider';
import ItemPreview from "./item/ItemPreview"

class Profile extends Component {

  static contextType = AuthContext;

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      username: '',
      steam_id: '',
      date_joined: '',
      items_to_buy: [],
      items_to_sell: [],
    }
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
          steam_id: response.data.user_info.steamid,
          date_joined: response.data.user_info.date_joined,
          items_to_buy: response.data.user_info.items_to_buy,
          items_to_sell: response.data.user_info.items_to_sell,
        });
      }
    });
  }

  render() {
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
                  <th scope="row">Email</th>
                  <td>{this.state.email}</td>
                </tr>
              : null
            }
            <tr>
              <th scope="row">SteamID</th>
              <td>{this.state.steamid ? <a href={'https://steamcommunity.com/' + this.state.steamid}>Steam profile</a> : 'None'}</td>
            </tr>
            <tr>
              <th scope="row">Joined on</th>
              <td>{new Date(this.state.date_joined).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>

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
