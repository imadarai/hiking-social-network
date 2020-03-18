import React, { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useSelector } from "react-redux";


export default function Chat () {

    const chatMessages = useSelector (
        state => state && state.chatMessages
    );
    console.log("here are my last 10 chat messages: ". chatMesages);

    const elementRef = useRef();

    useEffect(() => {
        console.log("Chat component mounted");
        console.log('elementRef: ', elementRef.current);
        console.log("scroll top: ", elementRef.current.scrollTop);
        console.log("scroll height: ", elementRef.current.scrollHeight);
        console.log("client height: ", elementRef.current.clientHeight);
        elementRef.current.scrollTop = elementRef.current.scrollHeight - elementRef.current.clientHeight;
    }, []);

    const keyCheck = e => {

        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value: ", e.target.value);
            socket.emit('muffin', e.target.value);
            e.target.value = " ";
        }
    };

    return (
        <div className ="chat">
            <h1>Chat Room </h1>
            <div className="chat-container" ref = {elementRef}>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
                <p>Chat Messages will go here ...</p>
            </div>
            <textarea
                placeholder ="Add your message here"
                onKeyDown ={keyCheck}
            >
            </textarea>
        </div>
    );
}
