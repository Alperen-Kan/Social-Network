import React from "react";

export default function Error(props) {
    if (props.errors) {
        return (
            <div id="error-messages">
                {props.errors.map(error => (
                    <p className="error" key={error}>{error}</p>
                ))}
            </div>
        );
    }
}
