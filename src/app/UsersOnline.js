import React, { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import ProfilePic from "./ProfilePic";

export default function UsersOnline() {
    const usersOnline = useSelector(
        state => state && state.usersOnline
    );

    return (
        <>
            {usersOnline && usersOnline.map(user => (
                <ProfilePic
                    id={user.id}
                    first={user.first}
                    last={user.last}
                    url={user.url}
                />
            ))}
        </>
    )
}
