import React, { Component } from "react";
import ItemPreview from "./item/ItemPreview"

class Search extends Component{
  constructor(props) {
    super(props);
    this.state = {
      searchValue:'',
      rarity:'',
      minPrice:'',
      maxPrice:'',
      ordering:'',
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleRarityChange = this.handleRarityChange.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
    this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
    this.handleOrderingChange = this.handleOrderingChange.bind(this);
  }

  handleSearchChange(event){
    this.setState({searchValue: event.target.value});
  }

  handleRarityChange(event){
    this.setState({rarity: event.target.value});
  }

  handleMinPriceChange(event){
    this.setState({minPrice: event.target.value});
  }

  handleMaxPriceChange(event){
    this.setState({maxPrice: event.target.value});
  }

  handleOrderingChange(event){
    this.setState({ordering: event.target.value});
  }

  updateSearchResult() {

      var route = "item/search/?name="+this.state.searchValue+"&rarity="+this.state.rarity+"&min_price="+this.state.minPrice+"&max_price="+this.state.maxPrice+"&ordering="+this.state.ordering;
      console.log(route);
      // TODO finish retrieving parameters, create route and search
  }

  search(route){
    fetch(route)
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  componentDidMount() {
    this.search("item/search/");
  }

  render() {
    return (
      <div>
        <div className="search-container">
          <form onSubmit={this.updateSearchResult}>
            <input id="searchbar" type="text" placeholder="Search.." name="search" value={this.state.searchValue} onChange={this.handleSearchChange}/>
            <button  onClick={this.updateSearchResult()}>{/*<i className="fa fa-search"></i>*/}Submit</button>

            <select id="rarity" value={this.state.rarity} onChange={this.handleRarityChange}>
              <option value="ALL">All rarities</option>
              <option value="COG">Consumer grade</option>
              <option value="ING">Industrial grade</option>
              <option value="MIS">Mil-spec</option>
              <option value="RST">Restricted</option>
              <option value="CLA">Classified</option>
              <option value="COV">Covert</option>
              <option value="EXR">Exceedingly Rare</option>
              <option value="CON">Contraband</option>
              <option value="RES">High Grade Sticker</option>
              <option value="HGS">Remarkable Sticker</option>
              <option value="EXS">Extraordinary Sticker</option>
              <option value="EXG">Extraordinary Gloves</option>
            </select>
            <label for="minPrice">Minimal price:</label>
            <input id="minPrice" type="number" min="0" max="7500" value="0" name="minPrice" value={this.state.minPrice} onChange={this.handleMinPriceChange}/>
            <label for="maxPrice">Maximal price:</label>
            <input id="maxPrice" type="number" min="0" max="7500" value="7500" name="maxPrice" value={this.state.maxPrice} onChange={this.handleMaxPriceChange}/>
            <select id="ordering" value={this.state.ordering} onChange={this.handleOrderingChange}>
              <option value="">None</option>
              <option value="price">Price ascending</option>
              <option value="price_reverse">Price descending</option>
              <option value="rarity">Rarity ascending</option>
              <option value="rarity_reverse">Rarity descending</option>
              <option value="name">Name A-Z</option>
              <option value="name_reverse">Name Z-A</option>
            </select>
          </form>

        </div>
        <div className="result-container">
          {this.state.data.map(item => {
            return (
              <ItemPreview url={item.item_image} name={item.name} price={item.lowest_price}/>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Search;
