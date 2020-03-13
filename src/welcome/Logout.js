import React from "react";
import axios from "../axios";

export default function Logout() {
    // const clickHandler = () => {
    //     axios.get("/logout");
    // };

    return (
        <a href="/logout">
            <h3>Log out</h3>
        </a>
    );
}
