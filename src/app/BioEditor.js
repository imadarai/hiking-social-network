import React from "react";
import axios from "../axios";

export default class BioEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.captureBio = this.captureBio.bind(this);
        this.saveBio = this.saveBio.bind(this);
    }
    componentDidMount() {
        console.log("Props when mounting: ", this.props);
        console.log("State when Mounting: ", this.state);
        if (this.props.bio != null) {
            this.setState({bio: this.props.bio});
        } else {
            this.setState({isThereBio: false});
        }
        console.log("State after Mounting: ", this.state);
    }
    async saveBio(e) {
        e.preventDefault();
        try {
            console.log("Bio being passed to server: ", this.state.newBio);
            const {data} = await axios.post("/user/updatebio", this.state.newBio);
            console.log(data);
            this.toggleEditor();
            this.props.setBio(data.bio);
        } catch (err) {
            console.log("Err in axios.post /user/updatebio: ", err);
        }
    }
    captureBio (e) {
        this.setState({
            [e.target.name]: e.target.value,
        }, console.log("Logging this.state when user enters:", this.state));
    }
    render() {
        return (
            <div>
                <p>{this.state.bio}</p>
                <textarea onChange={this.captureBio} name ="newBio" placeholder="please enter your bio here"/>
                <button onClick={this.saveBio}>save bio</button>
            </div>
        );
    }

}
