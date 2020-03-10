//component showing the entirety of other person's profile
import React from "react";
import axios from "../axios";


export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        try {
            let {data} = await axios.get(`/api/userprofile/${this.props.match.params.id}`);
            console.log("Response from server in OtherProfile: ", data);
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
                <img className="profile-pic"
                    src={this.state.profilePic || "../images/profilepic.png"}
                    alt={`${this.state.first} ${this.state.last}`}
                />
                <p>{this.state.first} {this.state.last}</p>
                <p>{this.state.bio}</p>
            </div>
        );
    }
}

//CLASS CODE ALONG
// import React from "react";
// import axios from "./axios";
//
//
// export default class OtherProfile extends React.Component {
//     constructor (props) {
//         super(props);
//         this.state = {};
//     }
//
//     componentDidMount() {
//         axios.get(`/user/${this.props.match.params.id}.json`).then (
//             ({data}) => this.setState();
//         )
//     }
//     render () {
//         return (
//             <div>
//             </div>
//         )
//     }
// }
