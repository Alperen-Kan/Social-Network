import React from "react";

export default function({url, first, last, openUploader}) {
    return (
        <img id="profile-pic"
            src={url}
            alt={`${first} ${last}`}
            onClick={openUploader}
        />
    );
}
