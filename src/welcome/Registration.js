import React from "react";
import Error from "./Error";
import axios from "../axios";
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        /*this.setError = this.setError.bind(this);*/
    }

    handleChange(e) {
        this.setState(
            {[e.target.name]: e.target.value},
            () => console.log(this.state)
        );
        if (this.state.errors[e.target.name]) {
            this.setState(state => {
                const errors = this.state.errors;
                errors[e.target.name] = false;
                return {errors};
            });
        }
    }

    async submit(e) {
        e.preventDefault();
        if (
            this.state.first &&
            this.state.last &&
            this.state.email &&
            this.state.password &&
            (this.state.password === this.state.password2)
        ) {

            const { data } = axios.post("/registration", {data: this.state});
            if (data.success) {
                location.replace('/');
            } else {
                // error in registration
            }
        } else {
            // error: form not filled out
        }
    }

    render() {
        return (
            <div id="form-container">
                <h1>Register</h1>
                <form onSubmit={this.submit}>
                    <input onChange={this.handleChange} type="text" name="first" placeholder="first name"/>

                    <input onChange={this.handleChange} type="text" name="last" placeholder="last name"/>

                    <input onChange={this.handleChange} type="text" name="email" placeholder="email"/>

                    <input onChange={this.handleChange} type="password" name="password" placeholder="password"/>

                    <input onChange={this.handleChange} type="password" name="password2" placeholder="repeat password"/>

                    <button type="submit">submit</button>
                </form>
                {/*<Error errors={this.state.errors} />*/}
                <Link to="/login">Log in</Link>
            </div>
        );
    }
}
