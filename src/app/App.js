import React from "react";
import axios from "../axios";
import { BrowserRouter, Route } from 'react-router-dom';
import Profile from "./Profile.js";
import ProfilePic from "./ProfilePic.js";
import Uploader from "./Uploader.js";
import BioEditor from "./BioEditor.js";
import OtherProfile from "./OtherProfile.js";
import UserSearch from "./UserSearch";
import Friends from "./FriendList";
import Chat from "./Chat.js";
import Header from "./Header.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.whatToRender = this.whatToRender.bind(this);
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get("/user/info");
            this.setState(data);
        } catch (err) {
            console.log("Error in getting User Information axios use/info: ",  err);
        }
    }

    whatToRender (){
        if (location.pathname == "/chat") {
            this.setState({
                renderChat: true,
            });
        }
    }

    render() {
        if (!this.state.userId) {
            return <img className="loading" src="../images/loading.gif" alt="Loading..." />;
        }
        return (
            <div>
                <BrowserRouter>
                    <div className="app-main">

                        <Header />

                        <div className = "app-body">
                            <div className = "app-profile">
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
                                { this.state.uploaderVisible &&
                                        <Uploader
                                            id={this.state.userId}
                                            updateImage={url => this.setState({
                                                profilePic: url
                                            })}
                                            closeUploaderModal={ () => this.setState({
                                                uploaderVisible: false
                                            })}
                                        />
                                }
                            </div>
                            <div className ="app-content">

                                <Route path="/userprofile/:id" component={OtherProfile} />
                                <Route path="/usersearch" component={UserSearch} />
                                <Route path="/friends" component={Friends} />
                                <Route path="/chat" component={Chat} />

                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
