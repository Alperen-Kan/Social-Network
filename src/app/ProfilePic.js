import React from "react";

export default function({url = "/default.jpg", first, last, openUploader}) {
    return (
        <img id="profile-pic"
            src={url}
            alt={`${first} ${last}`}
            onClick={openUploader}
        />
    );
}
