import React from "react";
import axios from "../axios";
import Profile from "./Profile.js";
import ProfilePic from "./ProfilePic.js";
import Uploader from "./Uploader.js";
import BioEditor from "./BioEditor.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get("/user/info");
            this.setState(data);
            console.log(data);
        } catch (err) {
            console.log("Error in getting User Information axios use/info: ",  err);
        }
    }

    render() {
        if (!this.state.userId) {
            return <img className="loading" src="../images/loading.gif" alt="Loading..." />;
        }
        return (
            <div>
                <h1>Welcome!</h1>
                <Profile
                    first = {this.state.first}
                    last = {this.state.last}

                    profilePic ={
                        <ProfilePic
                            first ={this.state.first}
                            last = {this.state.last}
                            url = {this.state.profilePic}
                            openUploader={() => this.setState({
                                uploaderVisible: true
                            })}
                        />
                    }
                    bioEditor={
                        <BioEditor
                            bio={this.state.bio}
                            setBio={newBio => this.setState({
                                bio: newBio
                            })}
                        />
                    }
                />
                {this.state.uploaderVisible &&
                        <Uploader
                            id={this.state.userId}
                            updateImage={url => this.setState({
                                profilePic: url
                            })}
                            closeUploaderModal={ () => this.setState({
                                uploaderVisible: false
                            })}
                        />}
            </div>
        );
    }
}
