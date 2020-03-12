import React from "react";

export default function({id, url = "/default.jpg", first, last, clickHandler}) {
    return (
        <img className="profile-pic"
            src={url}
            alt={`${first} ${last}`}
            onClick={clickHandler}
        />
    );
}
