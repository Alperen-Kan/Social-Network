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

    if (action.type === "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type === "CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [
                ...state.chatMessages,
                action.chatMessage
            ]
        };
    }

    if (action.type === "USERS_ONLINE") {
        state = {
            ...state,
            usersOnline: action.users
        };
    }

    if (action.type === "USER_IS_ONLINE") {
        state = {
            ...state,
            usersOnline: [
                ...state.usersOnline,
                action.user
            ]
        };
    }

    if (action.type === "USER_IS_OFFLINE") {
        state = {
            ...state,
            usersOnline: state.usersOnline.filter(user => user.id != action.user.id)
        };
    }

    if(action.type === "IMAGE_CHANGE") {
        state = {
            ...state,
            
        }
    }

    return state;
}
