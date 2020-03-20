import React, { useState, useEffect } from "react";
import axios from "../axios";
import { socket } from "../socket";
import Button from '@material-ui/core/Button';

export default function FriendButton({otherUserId}) {

    const [buttonText, setButtonText] = useState('Make Friend Request');

    let color;

    const handleClick = (e) => {
        (async () => {
            e.preventDefault();
            console.log("handleClick has been clicked");
            try {
                if (buttonText == "Make Friend Request") {
                    const { data } = await axios.post(`/make-friend-request/${otherUserId}`);
                    socket.emit("friendRequestUpdate", otherUserId);
                    setButtonText(data.buttonText);

                } else if (buttonText == "Accept Friend Request") {
                    const { data } = await axios.post(`/accept-friend-request/${otherUserId}`);
                    socket.emit("friendRequestUpdate", otherUserId);
                    setButtonText(data.buttonText);

                } else {
                    const { data } = await axios.post(`/end-friendship/${otherUserId}`);
                    socket.emit("friendRequestUpdate", otherUserId);
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

    if (buttonText=="Make Friend Request") {
        color = "primary";
    } else {
        color = "secondary";
    }

    return (
        <Button onClick={handleClick} variant="contained" color={color}>
            {buttonText}
        </Button>
    );
}
