import React from "react";
import axios from "../axios";

export default class FriendRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.submit = this.submit.bind(this);
    }

    submit() {
        axios.post(`/friendStatus/${this.props.requestId}`, {
            friendship: this.state.friendship,
            rejectFlag: this.state.rejectFlag
        }).then(({ data }) => {
            if (data.error) {
                this.setState({
                    buttonText: data.buttonText,
                    friendship: data.friendship,
                    error: data.error
                });
            } else {
                this.setState({
                    buttonText: data.buttonText,
                    friendship: data.friendship,
                    rejectText: data.rejectText,
                    rejectFlag: data.rejectFlag
                });
            }
            console.log("state end of Submit funciton: ", this.state);
        }).catch(err => console.log("Err in /friendstatus post request in component", err));
    }

    componentDidMount() {
        axios.get(`/friendStatus/${this.props.requestId}`).then(({ data }) => {
            console.log("Data received from server when mounting page: ", data);
            if (data.rejectFlag) {
                this.setState({
                    buttonText: data.buttonText,
                    friendship: data.friendship,
                    rejectText: data.rejectText,
                    rejectFlag: data.rejectFlag
                });
            } else {
                this.setState({
                    buttonText: data.buttonText,
                    friendship: data.friendship
                });
            }
            console.log("State at the end of mounting: ", this.state);
        }).catch(err => console.log("Err in /friendStatus on mounting: ", err));
    }

    render() {
        return (
            <button onClick={this.submit}>{this.state.buttonText}</button>
        );
    }
}
