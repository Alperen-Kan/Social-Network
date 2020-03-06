import React from "react";
import Error from "./Error";
import axios from "../axios";
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {[e.target.name]: e.target.value},
            () => console.log(this.state)
        );
    }

    submit(e) {
        e.preventDefault();
        if (this.state.email &&
            this.state.password) {

            axios.post("/login", {data: this.state})
                .then(response => {
                    console.log("response:", response);
                    location.replace('/');
                })
                .catch(error => {
                    console.log("error in POST /registration", error);
                });
        } else {

        }
    }

    render() {
        return (
            <div id="form-container">
                <h1>Log in</h1>
                <form onSubmit={this.submit}>

                    <input onChange={this.handleChange} type="text" name="email" placeholder="email"/>

                    <input onChange={this.handleChange} type="password" name="password" placeholder="password"/>

                    <button type="submit">Log in</button>
                </form>
                <Link to="/reset">Reset password</Link>
            </div>
        );
    }


}
