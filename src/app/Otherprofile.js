import React, { useState, useEffect, useRef } from "react";
import axios from "../axios";
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, privateMessages, privateMessage } from "../actions";
import { socket } from "../socket";
import FriendButton from "./FriendButton";
import ProfilePic from "./ProfilePic";
import BasicTextFields from "./BasicTextFields";
import ProfileCard from './Profilecard';


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
    }

    const dateFormat = dateStr => {
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
        <>
            {
                otherUser.id &&
                    <ProfileCard
                        id={otherUser.id}
                        url={otherUser.url}
                        first={otherUser.first}
                        last={otherUser.last}
                        bio={otherUser.bio}
                        button={<FriendButton otherUserId={otherUser.id} />}
                    />
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
                                    <b><span className="chat-username">{msg.first} {msg.last}</span></b>
                                    <span className="chat-message-time"> {dateFormat(msg.created_at)}</span>
                                    <p className="message-on-display">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <BasicTextFields keyHandler={keyCheck}/>

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
