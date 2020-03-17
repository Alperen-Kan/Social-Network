import * as io from 'socket.io-client';

import { chatMessages, chatMessage } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        // socket.on("muffinMagic", myMuffin => {
        //     console.log("myMuffin on the client side:", myMuffin);
        // });

        socket.on(
            'chatMessages',
            msgs => {
                console.log("chatMessages received:", msgs);
                store.dispatch(
                    chatMessages(msgs)
                );
            }
        );

        socket.on(
            'chatMessage',
            msg => {
                console.log("new chatMessage received:", msg);
                store.dispatch(
                    chatMessage(msg)
                );
            }
        );
    }
};
