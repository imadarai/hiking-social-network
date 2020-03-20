import React from "react";
import axios from "../axios";
import { Link } from 'react-router-dom';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendCode = this.sendCode.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    handleChange (e) {
        this.setState ({
            [e.target.name]: e.target.value,
        });
    }

    sendCode(e) {
        e.preventDefault();
        if (this.state.email) {
            axios.post("/resetpassword/start", this.state )
                .then( results => {
                    if (results) {
                        this.setState({currentDisplay: 2});
                    }
                })
                .catch(err => {
                    console.log("error in POST /reserpassword/start", err);
                    this.setState({error: "Invalid Email. Please try again"});
                });
        } else {
            this.setState({error: "Please enter an Email to begin"});
        }
    }

    resetPassword(e) {
        e.preventDefault();
        if (this.state.secretcode && this.state.password && (this.state.password === this.state.repeatpassword)) {
            console.log(this.state);
            axios.post("/resetpassword/verify", this.state ).then (results => {
                if (results) {
                    this.setState({currentDisplay: 3});
                }
            }).catch(err => {
                this.setState({error: "Invalid Code. Please Try Again."});
                console.log("Err in POST /resetpassword/verify in reset.js", err);
            });
        }
        if (this.state.password != this.state.repeatpassword) {
            this.setState({error: "Password does not Match.  Please try again"});
        }
    }

    render() {
        const { currentDisplay } = this.state;
        return (
            <div>
                { currentDisplay == 1 &&
                    <div>
                        <div className ="auth-container animated fadeIn">
                            <h3>Reset Password</h3>
                            <p className="error"> { this.state.error } </p>
                            <form className = "form-container">
                                <input onChange={this.handleChange} type="text" name="email" placeholder="Email"/>
                                <button className="simpleButton"  onClick={this.sendCode}>RESET PASSWORD</button>
                            </form>
                        </div>
                    </div>}
                { currentDisplay == 2 &&
                    <div>
                        <div className ="auth-container animated fadeIn">
                            <h3>Check your Email and Enter the Code below</h3>
                            <p className="error"> { this.state.error } </p>
                            <form className = "form-container">
                                <input onChange={this.handleChange} type="text" name="secretcode" placeholder="Reset Code"/>
                                <input onChange={this.handleChange} type="password" name="password" placeholder="Password"/>
                                <input onChange={this.handleChange} type="password" name="repeatpassword" placeholder="Re-enter Password"/>
                                <button className="simpleButton" onClick={this.resetPassword}>Submit</button>
                            </form>
                        </div>
                    </div>}
                { currentDisplay == 3 &&
                    <div>
                        <div className ="auth-container animated fadeIn">
                            <h3>Your Password has been succesfully updated.</h3>
                            <Link to="/login">Log in</Link>
                        </div>
                    </div>}
            </div>
        );
    }
}
