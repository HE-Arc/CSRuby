import React, { Component } from "react";
import { MContext } from './Provider';

class Search extends Component{
  render() {
    return (
      <div>
        <div className="search-container">
          <form action="">
            <input id="searchbar" type="text" placeholder="Search.." name="search"/>
            <button type="submit">{/*<i className="fa fa-search"></i>*/}Submit</button>

            <select id="rarity">
              <option value="ALL">All rarities</option>
              <option value="COG">Consumer grade</option>
              <option value="ING">Industrial grade</option>
              <option value="MIS">Mil-spec</option>
              <option value="RES">Restricted</option>
              <option value="CLA">Classified</option>
              <option value="COV">Covert</option>
              <option value="EXR">Exceedingly Rare</option>
              <option value="CON">Contraband</option>
            </select>
            <label for="minPrice">Minimal price:</label>
            <input id="minPrice" type="number" min="0" max="7500" value="0" name="minPrice"/>
            <label for="maxPrice">Maximal price:</label>
            <input id="maxPrice" type="number" min="0" max="7500" value="7500" name="maxPrice"/>
            <select id="oredering">
              <option value="ASC">Ascendant</option>
              <option value="DES">Descendant</option>
            </select>

          </form>
          <MContext.Consumer>
            {(context) => (
              <p>{context.state.message}</p>
            )}
          </MContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Search;
