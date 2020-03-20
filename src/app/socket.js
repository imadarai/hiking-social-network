import { chatMessages, chatMessage, onlineUsers } from "../redux/actions";
import * as io from "socket.io-client";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));
        socket.on("onlineUsers", user => store.dispatch(onlineUsers(user)));
    }
};
