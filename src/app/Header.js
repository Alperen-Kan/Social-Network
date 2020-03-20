import React from "react";
import ProfilePic from "./ProfilePic";
import { Link } from 'react-router-dom';
import Logout from "../welcome/Logout";

export default function Header ({data}) {

    return (
        <div className="header">

            <h1>Social Isolation</h1>

            <div className="header-link-container">
                <Link className="header-link" to="/users-online">
                    <h3>See who&apos;s online</h3>
                </Link>

                <Link className="header-link" to="/chat">
                    <h3>Chat</h3>
                </Link>

                <Link className="header-link" to="/findpeople">
                    <h3>Find People</h3>
                </Link>

                <Link className="header-link" to="/friends">
                    <h3>Friends</h3>
                </Link>

                <Logout/>

                <Link to="/">
                    <ProfilePic
                        id={data.id}
                        first={data.first}
                        last={data.last}
                        url={data.url}
                    />
                </Link>
            </div>
        </div>
    );
}
