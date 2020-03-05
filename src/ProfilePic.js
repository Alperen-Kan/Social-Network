import React from "react";

export default function({url, first, last, clickHandler}) {
    return (
        <img
            src={url}
            alt={`${first} ${last}`}
            onClick={clickHandler}
        />
    );
}
