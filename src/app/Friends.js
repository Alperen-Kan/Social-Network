import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, acceptFriendRequest, endFriendship } from "../actions";
import ProfilePic from "./ProfilePic";

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
        {friends && friends.map(friend => (
            <div>
            <ProfilePic
                id={friend.id}
                url={friend.url}
                first={friend.first}
                last={friend.last}
            />
            <button onClick={() => dispatch(endFriendship(friend.id))}>End Friendship</button>
            </div>
        ))}

        {nonFriends && nonFriends.map(nonFriend => (
            <div>
            <ProfilePic
                id={nonFriend.id}
                url={nonFriend.url}
                first={nonFriend.first}
                last={nonFriend.last}
            />
            <button onClick={() => dispatch(acceptFriendRequest(nonFriend.id))}>Accept Friendship</button>
            </div>
        ))}

        </>
    )
}
