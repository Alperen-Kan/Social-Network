import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, acceptFriendRequest, endFriendship } from "../actions";
import ProfilePic from "./ProfilePic";
import Button from '@material-ui/core/Button';
import SimpleCard from './simplecard';

export default function Friends() {

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(receiveFriends());
    }, []);

    const friends = useSelector(
        state => state.friends && state.friends.filter(
            friend => friend.accepted == true
        )
    )

    const nonFriends = useSelector(
        state => state.friends && state.friends.filter(
            nonFriend => nonFriend.accepted == false
        )
    )

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
            <h2>Received friend requests</h2>
            {nonFriends && nonFriends.map(nonFriend => (
                <div key={nonFriend.id}>
                <ProfilePic
                    id={nonFriend.id}
                    url={nonFriend.url}
                    first={nonFriend.first}
                    last={nonFriend.last}
                />
                <Button onClick={() => dispatch(acceptFriendRequest(nonFriend.id))} variant="contained" color="primary">
                    Accept Friendship
                </Button>

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
