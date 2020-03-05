import React, { Component } from "react";

class Search extends Component{
  render() {
    return (
      <div>
        <div className="search-container">
          <form action="">
            <input id="searchbar" type="text" placeholder="Search.." name="search"/>
            <button type="submit">{/*<i className="fa fa-search"></i>*/}Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Search;
