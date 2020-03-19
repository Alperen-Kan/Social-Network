import axios from "./axios";
import { socket } from "./socket";
import { useSelector } from "react-redux";

// if other user is online emit message

export async function receiveFriends() {
    const { data } = await axios.get("/friends.json");
    return {
        type: "RECEIVE_FRIENDS",
        friends: data
    };
}

export async function acceptFriendRequest(otherUserId) {

    await axios.post(`/accept-friend-request/${otherUserId}`);

    // if otherUserId is online use socket.io to notify otherUserId
    socket.emit("acceptFriendRequest", otherUserId);

    return {
        type: "ACCEPT_FRIENDSHIP",
        otherUserId: otherUserId
    };
}

export async function endFriendship(otherUserId) {
    await axios.post(`/end-friendship/${otherUserId}`);
    console.log("endFriendship about to reduce");
    console.log("endFriendship otherUserId:", otherUserId);
    return {
        type: "END_FRIENDSHIP",
        otherUserId: otherUserId
    };
}

export function chatMessages(messages) {
    console.log("chatMessages action running");
    console.log("chatMessages data:", messages);
    return {
        type: "CHAT_MESSAGES",
        chatMessages: messages
    };
}

export function chatMessage(messageObj) {
    console.log("chatMessage action running");
    console.log("chatMessageObj:", messageObj);
    return {
        type: "CHAT_MESSAGE",
        chatMessage: messageObj
    };
}

export function usersOnline(users) {
    console.log("usersOnline action running");
    return {
        type: "USERS_ONLINE",
        users: users
    };
}

export function userIsOnline(user) {
    console.log("userIsOnline action running");
    return {
        type: "USER_IS_ONLINE",
        user: user
    };
}

export function userIsOffline(user) {
    console.log("userIsOffline action running");
    return {
        type: "USER_IS_OFFLINE",
        user: user
    };
}

export function imageChange(user) {
    console.log("imageChange running");
    return {
        type: "IMAGE_CHANGE",
        user: user
    };
}
