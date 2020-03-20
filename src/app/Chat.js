import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { socket } from "./socket";
// import Moment from "react-moment";
// import "moment-timezone";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.elemRef = React.createRef();
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    keyPressed(event) {
        if (event.key === "Enter") {
            this.submit();
        }
    }
    submit() {
        socket.emit("chatMessage", this.state.chat);
        this.setState({
            chat: ""
        });
    }

    componentDidMount() {}
    componentDidUpdate() {
        this.elemRef.current.scrollTop = this.elemRef.current.scrollHeight- this.elemRef.current.clientHeight;
    }

    render() {
        return (
            <div>
                <h1>Chatbox</h1>
                <div>
                    <div className ="chat-container" ref={this.elemRef}>
                        {this.props.chatMessages &&
                            this.props.chatMessages.map(chat => (
                                <div key={chat.msg_id}>
                                    <Link to={`/userprofile/${chat.user_id}`}>
                                        {chat.first + " " + chat.last + " at "}
                                    </Link>
                                    <div>
                                        <img className="chat-avatar"
                                            url={chat.image_url}
                                            username={chat.username}
                                        />
                                        {chat.message}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <textarea
                        name="chat"
                        id=""
                        value={this.state.chat}
                        cols="30"
                        rows="10"
                        onChange={e => this.handleChange(e)}
                        onKeyPress={e => this.keyPressed(e)}
                    />
                    <button onClick={() => this.submit()}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        chatMessages: state.chatMessages
    };
};

export default connect(mapStateToProps)(Chat);
