import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ProfilePic from "./ProfilePic";
import OnlineCard from './OnlineCard';

export default function UsersOnline() {
    const usersOnline = useSelector(
        state => state && state.usersOnline
    );

    // <ProfilePic
    // id={user.id}
    // first={user.first}
    // last={user.last}
    // url={user.url}
    // />
    return (
        <>
            <div className="friends-container">
                {usersOnline && usersOnline.map(user => (
                    <div key={user.id}>
                        <OnlineCard
                            id={user.id}
                            url={user.url}
                            first={user.first}
                            last={user.last}
                            clickHandler={() => clickHandler(user.id)}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}
