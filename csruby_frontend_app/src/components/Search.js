import React, { Component } from 'react';
import ItemPreview from './item/ItemPreview';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_value:'',
      rarity:'',
      min_price:0,
      max_price:7500,
      ordering:'',
      data: [],
      loaded: false,
      placeholder: 'Loading',
      offset: 0,
      limit_item: 8,
      has_more_item: true,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleRarityChange = this.handleRarityChange.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
    this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
    this.handleOrderingChange = this.handleOrderingChange.bind(this);
  }

  handleSearchChange(event) {
    this.setState({search_value: event.target.value, offset: 0, data:[]}, this.updateSearchResult);
  }

  handleRarityChange(event) {
    this.setState({rarity: event.target.value, offset: 0, data:[]}, this.updateSearchResult);
  }

  handleMinPriceChange(event) {
    this.setState({min_price: event.target.value, offset: 0, data:[]}, this.updateSearchResult);
  }

  handleMaxPriceChange(event) {
    this.setState({max_price: event.target.value, offset: 0, data:[]}, this.updateSearchResult);
  }

  handleOrderingChange(event) {
    this.setState({ordering: event.target.value, offset: 0, data:[]}, this.updateSearchResult);
  }

  updateSearchResult = () => {
    var url = '/item/search?name=' + this.state.search_value + '&rarity=' + this.state.rarity + '&min_price=' + this.state.min_price + '&max_price=' + this.state.max_price + '&order_by=' + this.state.ordering + '&offset=' + this.state.offset;
    this.fetchItems(url);
  }

  onSubmit(event) {
    console.log("OnSubmit");
    var url = '/item/search?name=' + this.state.search_value + '&rarity=' + this.state.rarity + '&min_price=' + this.state.min_price + '&max_price=' + this.state.max_price + '&order_by=' + this.state.ordering + '&offset=' + this.state.offset;
    this.fetchItems(url);
    event.preventDefault();
  }

  fetchMore(){
    console.log("FETCHING MORE");
    var url = '/item/search?name=' + this.state.search_value + '&rarity=' + this.state.rarity + '&min_price=' + this.state.min_price + '&max_price=' + this.state.max_price + '&order_by=' + this.state.ordering + '&offset=' + this.state.offset;
    this.fetchItems(url);
  }

  fetchItems(url) {
    console.log("FETCHING");
    this.setState({
      loaded: false,
      has_more_item:false,
    });

    axios({
      method: 'get',
      url: url,
    })
    .then((response) => {
      if(response.status === 200) {
        var allData = this.state.data;
        response.data.map(item => allData.push(item));
        this.setState({
          data: allData,
          loaded: true,
          offset: this.state.offset+this.state.limit_item,
        });
        this.setState({has_more_item:response.data.length==this.state.limit_item});
      }
    })
    .catch((error) => {
      this.setState({
        placeholder: 'Something went wrong!'
      })
    });
  }

  componentDidMount() {
    this.fetchItems('/item/search');
  }

  render(){
    const loader = <div className="text-center"><div className="loadingio-spinner-rolling-oq809e0ojtq"><div className="ldio-5u0wj89ps2u"><div></div></div></div></div>;
    var items = [];
    this.state.data.map(item=>{
      items.push(
        <ItemPreview key={item.item_id} itemId={item.item_id} url={item.item_image} name={item.name} price={item.lowest_price} rarity_class={item.rarity}/>
      )
    });
    return (
      <div className="container">
        <div className="csruby-bg-darkest p-4 mb-3">
          <form onSubmit={this.onSubmit} ref="form">
            <div className="form-row">
              <div className="form-group col mb-0">
                <input className="form-control" id="searchbar" type="text" placeholder="Search item..." name="search" value={this.state.search_value} onChange={this.handleSearchChange}/>
              </div>
              <div className="form-group col mb-0">
                <select className="form-control" id="rarity" value={this.state.rarity} onChange={this.handleRarityChange}>
                  <option value="">All rarities</option>
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
              </div>
              <div className="form-group col mb-0">
                <input className="form-control" id="min_price" type="number" min="0" max="7500" value="0" name="min_price" value={this.state.min_price} onChange={this.handleMinPriceChange} placeholder="Min price..."/>
              </div>
              <div className="form-group col mb-0">
                <input className="form-control" id="max_price" type="number" min="0" max="7500" value="7500" name="max_price" value={this.state.max_price} onChange={this.handleMaxPriceChange} placeholder="Max price..."/>
              </div>
              <div className="form-group col mb-0">
                <select className="form-control" id="ordering" value={this.state.ordering} onChange={this.handleOrderingChange}>
                  <option value="">None</option>
                  <option value="price">Price ascending</option>
                  <option value="price_reverse">Price descending</option>
                  <option value="rarity">Rarity ascending</option>
                  <option value="rarity_reverse">Rarity descending</option>
                  <option value="name">Name A-Z</option>
                  <option value="name_reverse">Name Z-A</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className="result-container" id="result-container">
          {this.state.data.length > 0
            ? <InfiniteScroll
                initialLoad={ false }
                loadMore={this.fetchMore.bind(this)}
                hasMore={this.state.has_more_item}
                loader={loader}
                useWindow={true}
                getScrollParent={() => document.getElementById('result-container')}>
                  {items}
            </InfiniteScroll>
            : <h3 className="text-dark text-center">{this.state.loaded == true && 'No items found...'}</h3>
          }
          {this.state.loaded == false &&
            <div className="text-center">
              <div className="loadingio-spinner-rolling-oq809e0ojtq">
                <div className="ldio-5u0wj89ps2u">
                  <div></div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Search;
