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
            <div className = "animated fadeIn">
                <h2>Global Chat</h2>
                <div className= "chat-main">
                    <div className ="chat-container" ref={this.elemRef}>
                        {this.props.chatMessages &&
                            this.props.chatMessages.map(chat => (
                                <div className="each-message" key={chat.msg_id}>
                                    <Link to={`/userprofile/${chat.user_id}`}>
                                        {chat.first + " " + chat.last}
                                    </Link>
                                    <div>
                                        <img className="chat-avatar"
                                            url={chat.image_url}
                                        />
                                        {":" + " " + chat.message}
                                    </div>
                                </div>
                            ))}
                    </div>
                    <textarea
                        className = "chat"
                        name="chat"
                        id=""
                        placeholder ="Enter your message here"
                        value={this.state.chat}
                        onChange={e => this.handleChange(e)}
                        onKeyPress={e => this.keyPressed(e)}
                    ></textarea>
                    <button className="bio" onClick={() => this.submit()}>
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
