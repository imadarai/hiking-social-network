import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';



export default class Login extends React.Component {
    constructor () {
        super ();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }
    handleChange (e) {
        this.setState ({
            [e.target.name]: e.target.value,
        });
    }
    loginUser (e) {
        e.preventDefault();
        if (this.state.email && this.state.password) {
            axios.post("/login", this.state).then(function(response){
                if (response) {
                    location.replace('/');
                }
            }).catch(() => {
                this.setState({error: "Incorrect password, please try agian"});
            });
        }
        if (!this.state.email){
            this.setState({error: "Email is required"});
        }
        if (!this.state.password){
            this.setState({error: "Password is required"});
        }
    }

    render () {
        return (
            <div>
                <div className ="auth-container">
                    <h2>Login</h2>
                    <p className="error"> { this.state.error } </p>
                    <form className = "form-container">
                        <input onChange={this.handleChange} name="email" type ="email" placeholder="Email" required/>
                        <input onChange={this.handleChange} name="password" type ="password" placeholder="Password" required/>
                        <button className="simpleButton" onClick={this.loginUser}>LOGIN</button>
                    </form>
                    <Link to="/reset">Forgot Password?</Link>
                </div>
            </div>
        );
    }
}
