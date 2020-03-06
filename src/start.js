import React from 'react';
import ReactDOM from 'react-dom';
import axios from "./axios";
import Welcome from "./welcome/Welcome";
import App from "./app/App";

let component;
if (location.pathname === "/welcome") {
    // render the registration page
    component = <Welcome />;
} else {
    // render the logo
    component = <App />;
}

ReactDOM.render(
    component,
    document.querySelector('main')
);

// class components CAN have state
// function components CANNOT have state

// function HelloWorld() {
    //     return (
        //         <div>Hello, World!</div>
        //     );
// }

// class HelloWorld extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             // name: "alp"
//         };
//         this.handleClick = this.handleClick.bind(this);
//     };
//
//     componentDidMount() {
//         // lifecycle method
//         // this is a good place to do axios requests to fetch info from server!
//         // axios.get("/user").then( ({data}) => {
//         //     // do something
//         // });
//         setTimeout(() => {
//             // pretend this code only runs we've received response from server
//             // response included data we want to store somewhere
//             // and the logical place to store this data is state!
//             // this.state.name = responseFromServer // DONT DO THIS!
//             let name = "allspice";
//             this.setState({
//                 name
//             }); // DO THIS!
//         }, 2000);
//     }
//
//     handleClick() {
//         // console.log("handleClick running!");
//         this.setState({
//             name: "alistair"
//         });
//     }
//
//     render() {
//         return (
//             <div>
//                 <p className="headline">Hello, World!</p>
//                 <p onClick={this.handleClick}>This is a react component</p>
//                 <p>{this.state.name}</p>
//                 <p></p>
//                 <User name={this.state.name}/>
//             </div>
//         );
//     }
// }
//
// function User(props) {
//     return <h1>user! {props.name}</h1>
// }
