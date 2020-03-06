import React, { Component } from "react";

class Profile extends Component {
  render() {
    return (
      <div>
        <h1>Username</h1>
        <a href="https://steamcommunity.com/">Steam profile</a>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="selling-tab" data-toggle="tab" href="#selling" role="tab" aria-controls="selling" aria-selected="true">Selling</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="buying-tab" data-toggle="tab" href="#buying" role="tab" aria-controls="buying" aria-selected="false">Buying</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="favorite-tab" data-toggle="tab" href="#favorite" role="tab" aria-controls="favorite" aria-selected="false">Favorite</a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="selling" role="tabpanel" aria-labelledby="selling-tab">...</div>
          <div className="tab-pane fade" id="buying" role="tabpanel" aria-labelledby="buying-tab">...</div>
          <div className="tab-pane fade" id="favorite" role="tabpanel" aria-labelledby="favorite-tab">...</div>
        </div>
      </div>
    );
  }
}

export default Profile;
