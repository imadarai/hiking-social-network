import React from "react";
import axios from "../axios";

export default class BioEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.captureBio = this.captureBio.bind(this);
        this.saveBio = this.saveBio.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
    }
    componentDidMount() {
        if (this.props.bio != null) {
            this.setState({bio: this.props.bio});
        }
    }
    async saveBio(e) {
        e.preventDefault();
        try {
            console.log("State before: ", this.state);
            const {data} = await axios.post("/user/updatebio", this.state);
            this.props.setBio(data.bio);
            this.setState({bioEditorInvisible: false});
            console.log("State after: ", this.state);
        } catch (err) {
            console.log("Err in axios.post /user/updatebio: ", err);
        }
    }
    captureBio (e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    showEditForm () {
        this.setState({ bioEditorInvisible: true });
    }
    render() {
        return (
            <div className = "bio-container">
                { this.props.bio && !this.state.bioEditorInvisible &&
                    <div className ="visible-bio">
                        <p className="user-bio">{this.props.bio}</p><br/>
                        <button className="bio" onClick={this.showEditForm}>Edit Bio</button>
                    </div>
                }
                { !this.props.bio && !this.state.bioEditorInvisible &&
                        <button className="bio" onClick={this.showEditForm}>Add Bio</button>
                }
                { this.state.bioEditorInvisible &&
                    <div className ="visible-bio">
                        <textarea className ="enter-bio" onChange={this.captureBio} name ="newBio" placeholder="please enter your bio here"/><br/>
                        <button className="bio" onClick={this.saveBio}>Save bio</button>
                    </div>
                }
            </div>
        );
    }

}
