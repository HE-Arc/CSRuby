import React, { Component } from "react";
import { render } from "react-dom";
import ItemPreview from './item/ItemPreview';

class App extends Component {
  // constructor(props) {
    // super(props);
    // this.state = {
    //   data: [],
    //   loaded: false,
    //   placeholder: "Loading"
    // };
  // }

  // componentDidMount() {
    // fetch("api/users")
    //   .then(response => {
    //     if (response.status > 400) {
    //       return this.setState(() => {
    //         return { placeholder: "Something went wrong!" };
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     this.setState(() => {
    //       return {
    //         data,
    //         loaded: true
    //       };
    //     });
    //   });
  // }

  render() {
    return (
      // <ul>
        // <p> test </p>
        // {this.state.data.map(contact => {
        //   return (
        //     <li key={contact.id}>
        //       {contact.username} - {contact.password}
        //     </li>
        //   );
        // })}
      // </ul>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
