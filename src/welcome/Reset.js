import React from "react";
import axios from "../axios";
import { Link } from 'react-router-dom';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendCode = this.sendCode.bind(this);
        this.resetPW = this.resetPW.bind(this);
    }

    handleChange(e) {
        this.setState(
            { [e.target.name]: e.target.value },
            () => console.log(this.state)
        );
    }

    sendCode(e) {
        e.preventDefault();
        if (this.state.email) {
            axios.post("/password/reset/start", {email: this.state.email})
                .then(({data}) => {
                    console.log("start response:", data);
                    if (data.success) {
                        this.setState({
                            currentDisplay: 2
                        }, () => console.log("currentDisplay:", this.state.currentDisplay));
                    } else {
                        // display error message
                        console.log(data.error);
                    }
                })
                .catch(error => {
                    console.log("error in POST /", error);
                });
        } else {

        }
    }

    resetPW(e) {
        e.preventDefault();

        if (
            this.state.code &&
            this.state.password &&
            (this.state.password === this.state.password2)
        ) {

            axios.post("/password/reset/verify", {
                data: this.state
            })
                .then( ({data}) => {
                    console.log("verify response:", data);
                    if (data.success) {
                        this.setState({
                            currentDisplay: 3
                        }, () => console.log("currentDisplay:", this.state.currentDisplay));
                    }
                })
                .catch(error => console.log("error in POST /password/reset/verify"));
        }
    }

    render() {
        const { currentDisplay } = this.state;
        return (
            <div>
                { currentDisplay == 1 &&
                    <div>
                        <h1>Reset password</h1>
                        <form onSubmit={this.sendCode}>
                            <input onChange={this.handleChange} type="text" name="email" placeholder="email"/>
                            <button type="submit">Submit</button>
                        </form>
                    </div>}
                { currentDisplay == 2 &&
                    <div>
                        <h1>Reset password</h1>
                        <form onSubmit={this.resetPW}>
                            <input onChange={this.handleChange} type="text" name="code" placeholder="reset code"/>

                            <input onChange={this.handleChange} type="password" name="password" placeholder="password"/>

                            <input onChange={this.handleChange} type="password" name="password2" placeholder="repeat password"/>

                            <button type="submit">Submit</button>
                        </form>
                    </div>}
                { currentDisplay == 3 &&
                    <div>
                        <h1>Password reset has been successfull!</h1>
                        <Link to="/login">Log in</Link>
                    </div>}
            </div>
        )
    }
}
