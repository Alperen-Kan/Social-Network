import React, { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import ProfilePic from "./ProfilePic";
import BasicTextFields from "./BasicTextFields";

export default function Chat() {

    const chatMessages = useSelector(
        state => state && state.chatMessages
    );
    console.log("here are my last 10 chat messages:", chatMessages);

    const elementRef = useRef();

    useEffect(() => {
        console.log("chat component mounted");
        console.log("elementRef:", elementRef.current);
        console.log("scroll top:", elementRef.current.scrollTop);
        console.log("scroll height:", elementRef.current.scrollHeight);
        console.log("client height:", elementRef.current.clientHeight);

        elementRef.current.scrollTop = elementRef.current.scrollHeight - elementRef.current.clientHeight;
    });

    const keyCheck = e => {
        console.log("e.key:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value:", e.target.value);
            // socket.emit("muffin", e.target.value);
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };

    const dateFormat = dateStr => {
        // const year = dateStr.split("T")[0].split("-")[0];
        // const month = dateStr.split("T")[0].split("-")[1];
        // const day = dateStr.split("T")[0].split("-")[2];
        const [year, month, day] = dateStr.split("T")[0].split("-");
        const [hours, minutes, seconds] = dateStr.split("T")[1].split(".")[0].split(":");
        const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
        const options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        return new Intl.DateTimeFormat('de-DE', options).format(date);
    };

    return (
        <div className="chat">

            <h1>Chat room</h1>

            <div className="chat-container" ref={elementRef}>
                {chatMessages && chatMessages.map(msg => (
                    <div className="chat-message" key={msg.messageId}>
                        <ProfilePic
                            id={msg.userId}
                            url={msg.url}
                            first={msg.first}
                            last={msg.last}
                        />
                        <div>
                            <span className="chat-username">{msg.first} {msg.last}</span>
                            <span className="chat-message-time"> {dateFormat(msg.created_at)}</span>
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <BasicTextFields keyHandler={keyCheck}/>

        </div>
    );
}
