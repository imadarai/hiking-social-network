import React from "react";
import axios from "../axios";

export default class FriendRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFriendship = this.handleFriendship.bind(this);
    }
    handleFriendship() {
        axios.post(`/friendStatus/${this.props.requestId}`, {
            friendship: this.state.friendship
        }).then(({ data }) => {
            this.setState({
                buttonText: data.buttonText,
                friendship: data.friendship,
            });
        }).catch(err => console.log("Err in /friendstatus post request in component", err));
    }
    componentDidMount() {
        axios.get(`/friendStatus/${this.props.requestId}`).then(({ data }) => {
            // console.log("Data received from server when mounting page: ", data);
            this.setState({
                buttonText: data.buttonText,
                friendship: data.friendship
            });
            // console.log("State at the end of mounting: ", this.state);
        }).catch(err => console.log("Err in /friendStatus on mounting: ", err));
    }
    render() {
        return (
            <button className="bio" onClick={this.handleFriendship}>{this.state.buttonText}</button>
        );
    }
}
