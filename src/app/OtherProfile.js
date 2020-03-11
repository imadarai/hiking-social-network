//component showing the entirety of other person's profile
import React from "react";
import axios from "../axios";
import ProfilePic from "./ProfilePic";


export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        try {
            let {data} = await axios.get(`/api/userprofile/${this.props.match.params.id}`);
            if (data.error) {
                this.props.history.push('/');
            } else {
                this.setState(data);
            }
        } catch(err) {
            console.log("Err in mounting OtherProfile: ", err);
        }
    }
    render() {
        if (!this.state.userId) {
            return <img className="loading" src="../images/loading.gif" alt="Loading..." />;
        }
        return(
            <div className="public-profile-container">
                <ProfilePic
                    first ={this.state.first}
                    last = {this.state.last}
                    url = {this.state.profilePic}
                />
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
