import axios from "./axios";

export async function receiveFriends() {
    const { data } = await axios.get("/friends.json");
    return {
        type: "RECEIVE_FRIENDS",
        friends: data
    };
}

export async function acceptFriendRequest(otherUserId) {
    console.log("acceptFriendRequest running");
    await axios.post(`/accept-friend-request/${otherUserId}`);
    console.log("acceptFriendRequest about to reduce");
    console.log("acceptFriendRequest otherUserId:", otherUserId);
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
