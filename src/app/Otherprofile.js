import React, { useState, useEffect, useRef } from "react";
import axios from "../axios";
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, privateMessages, privateMessage } from "../actions";
import { socket } from "../socket";
import FriendButton from "./FriendButton";
import ProfilePic from "./ProfilePic";

export default function OtherProfile(props) {

    const dispatch = useDispatch();
    const [otherUser, setOtherUser] = useState({});
    const elementRef = useRef();

    useEffect(() => {
        dispatch(receiveFriends());
        socket.emit("privateMessages", props.match.params.id);

        axios.get(`/user/${props.match.params.id}.json`).then(
            ({data}) => {
                if (data.redirectTo == '/') { // if the server says the id in the url belongs to the logged in user (optional)
                    props.history.push('/');
                } else if (data.error) { // some test to determine a user was not found
                    console.log("error: user doesn't exist");
                } else {
                    // console.log("data:", data);
                    setOtherUser(data);
                }
            }
        );
    }, []);

    useEffect(() => {
        if (isFriend) {
            elementRef.current.scrollTop = elementRef.current.scrollHeight - elementRef.current.clientHeight;
        }
    });

    const privateMessages = useSelector(
        state => state && state.privateMessages
    );

    const isFriend = useSelector(state => {
        if (state.friends) {
            console.log("state.friends exists");
            for (var i = 0; i < state.friends.length; i++) {
                if (state.friends[i].id == props.match.params.id) {
                    console.log("state.friends[i].accepted:", state.friends[i].accepted);
                    return state.friends[i].accepted;
                }
            }
        }
    })


    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("privateMessage", {
                receiver_id: props.match.params.id,
                message: e.target.value
            });
            e.target.value = "";
        }
    };

    return (
        <>
            {
                otherUser.id &&
                <div>
                    <img
                        src={otherUser.url}
                        alt={`${otherUser.first} ${otherUser.last}`}
                    />
                    <FriendButton otherUserId={otherUser.id} />
                    <p>{otherUser.bio}</p>
                </div>
            }

            {
                isFriend &&
                <div className="chat">

                    <h1>Private Chat</h1>

                    <div className="chat-container" ref={elementRef}>
                        {privateMessages && privateMessages.map(msg => (
                            <div className="chat-message" key={msg.messageId}>
                                <ProfilePic
                                    id={msg.userId}
                                    url={msg.url}
                                    first={msg.first}
                                    last={msg.last}
                                />
                                <div>
                                    <span className="chat-username">{msg.first} {msg.last}</span>
                                    <span className="chat-message-time">{msg.created_at}</span>
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <textarea
                        placeholder="Add your message here"
                        onKeyDown={keyCheck}
                    />

                </div>
            }

        </>
    )

}



// export default class OtherProfile extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//
//     componentDidMount() {
//         axios.get(`/user/${this.props.match.params.id}.json`).then(
//             ({data}) => {
//                 if (data.redirectTo == '/') { // if the server says the id in the url belongs to the logged in user (optional)
//                     this.props.history.push('/');
//                 } else if (data.error) { // some test to determine a user was not found
//                     console.log("error: user doesn't exist");
//                     this.setState({
//                         error: true
//                     });
//                 } else {
//                     // console.log("data:", data);
//                     this.setState({ ...data}, () => console.log("this.state:",this.state));
//                 }
//             }
//         );
//     }
//
//     render() {
//         return (
//             <>
//                 {
//                     !this.state.error && this.state.id &&
//                     <div>
//                         <img
//                             src={this.state.url}
//                             alt={`${this.state.first} ${this.state.last}`}
//                         />
//                         <FriendButton otherUserId={this.state.id} />
//                         <p>{this.state.bio}</p>
//                     </div>
//                 }
//
//                 // check if otherUser is friend
//
//
//             </>
//         );
//     }
// }
