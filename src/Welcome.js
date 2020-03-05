import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import Reset from "./Reset";
import axios from "./axios";
import { HashRouter, Route } from "react-router-dom";




export default function Welcome() {
    return (
        <HashRouter>
            <div>
                <h1>Welcome to the socialnetwork!</h1>
                <div>
                    <Route exact component={Registration} path="/" />
                    <Route exact component={Login} path="/login" />
                    <Route exact component={Reset} path="/reset" />

                </div>

            </div>
        </HashRouter>
    );
}
