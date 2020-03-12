import React from "react";

export default function( { first, last, profilePic, bioEditor } ) {

    return (
        <div className="profile">
            {profilePic}
            <p>{first} {last}</p>
            {bioEditor}
        </div>
    );
}
