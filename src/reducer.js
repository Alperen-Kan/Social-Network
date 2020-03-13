export default function(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS") {
        state = {
            ...state,
            friends: action.friends
        };
    }

    if (action.type === "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.otherUserId) {
                    return {
                        ...friend,
                        accepted: true
                    };
                }
                return friend;
            })
        };
    }

    if (action.type === "END_FRIENDSHIP") {
        state = {
            ... state,
            friends: state.friends.filter(friend => friend.id != action.otherUserId)
        };
    }

    return state;
}
