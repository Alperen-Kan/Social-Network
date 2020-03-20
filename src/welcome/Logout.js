import React from "react";
import axios from "../axios";

export default function Logout() {
    // const clickHandler = () => {
    //     axios.get("/logout");
    // };

    return (
        <a className="header-link" href="/logout">
            <h3>Log out</h3>
        </a>
    );
}
