import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function FriendButton({otherUserId}) {

    const [buttonText, setButtonText] = useState('Make Friend Request');

    const handleClick = (e) => {
        (async () => {
            e.preventDefault();
            console.log("handleClick has been clicked");
            try {
                if (buttonText == "Make Friend Request") {
                    const { data } = await axios.post(`/make-friend-request/${otherUserId}`);
                    setButtonText(data.buttonText);

                } else if (buttonText == "Accept Friend Request") {
                    const { data } = await axios.post(`/accept-friend-request/${otherUserId}`);
                    setButtonText(data.buttonText);

                } else {
                    const { data } = await axios.post(`/end-friendship/${otherUserId}`);
                    setButtonText(data.buttonText);
                }
            } catch (e) {
                console.log("error in handleClick:", e);
            }
        })();
    };

    useEffect( () => {

        (async () => {
            try {
                console.log("otherUserId:", otherUserId);
                const { data } = await axios.get(`/initial-friendship-status/${otherUserId}`);
                console.log("GET /initial-friendship-status successfull:", data);
                setButtonText(data.buttonText);
            } catch (e) {
                console.log("error in GET /initial-friendship-status:", e);
            }
        })();

    }, []);

    return (
        <button onClick={handleClick}>{buttonText}</button>
    );
}
