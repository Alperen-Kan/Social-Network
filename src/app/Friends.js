import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, acceptFriendRequest, endFriendship, cancelFriendRequest } from "../actions";
import ProfilePic from "./ProfilePic";
import Button from '@material-ui/core/Button';
import SimpleCard from './simplecard';

export default function Friends(props) {

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(receiveFriends());
    }, []);

    const friends = useSelector(
        state => state.friends && state.friends.filter(
            friend => friend.accepted == true
        )
    )

    console.log("props:", props);

    const friendRequestsReceived = useSelector(
        state => state.friends && state.friends.filter(
            friend => friend.accepted == false && friend.sender_id != props.userId
        )
    )

    const friendRequestsSent = useSelector(
        state => state.friends && state.friends.filter(
            friend => friend.accepted == false && friend.sender_id == props.userId
        )
    )

    const clickHandler = id => {
        // console.log("I've been clicked", e);
        props.history.push(`/user/${id}`);
    };

    return (
        <>
        <div>
            <h2>Friends</h2>
            {friends && friends.map(friend => (
                <div key={friend.id}>
                <SimpleCard
                    id={friend.id}
                    url={friend.url}
                    first={friend.first}
                    last={friend.last}
                    clickHandler={() => clickHandler(friend.id)}
                    button={
                        <Button onClick={() => dispatch(endFriendship(friend.id))} variant="contained" color="secondary">
                            End Friendship
                        </Button>
                    }
                />
                </div>
            ))}
        </div>

        <div>
            <h2>Friend Requests Received</h2>
            {friendRequestsReceived && friendRequestsReceived.map(friend => (
                <div key={friend.id}>
                <SimpleCard
                    id={friend.id}
                    url={friend.url}
                    first={friend.first}
                    last={friend.last}
                    clickHandler={() => clickHandler(friend.id)}
                    button={
                        <Button onClick={() => dispatch(acceptFriendRequest(friend.id))} variant="contained" color="primary">
                            Accept Friend Request
                        </Button>
                    }
                />
                </div>
            ))}
        </div>

        <div>
            <h2>Friend Requests Sent</h2>
            {friendRequestsSent && friendRequestsSent.map(friend => (
                <div key={friend.id}>
                <SimpleCard
                    id={friend.id}
                    url={friend.url}
                    first={friend.first}
                    last={friend.last}
                    clickHandler={() => clickHandler(friend.id)}
                    button={
                        <Button onClick={() => dispatch(endFriendship(friend.id))} variant="contained" color="secondary">
                            Cancel Friend Request
                        </Button>
                    }
                />
                </div>
            ))}
        </div>

        </>
    )
}
// <button onClick={() => dispatch(endFriendship(friend.id))}>End Friendship</button>
// <button onClick={() => dispatch(acceptFriendRequest(nonFriend.id))}>Accept Friendship</button>
// <ProfilePic
//     id={friend.id}
//     url={friend.url}
//     first={friend.first}
//     last={friend.last}
// />
