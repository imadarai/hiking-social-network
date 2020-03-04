import React from 'react';
import axios from './axios';



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
                <h1>Login</h1>
                <p> { this.state.error } </p>
                <form>
                    <input onChange={this.handleChange} name="email" type ="email" placeholder="Email" required/>
                    <input onChange={this.handleChange} name="password" type ="password" placeholder="Password" required/>
                    <button onClick={this.loginUser}>LOGIN</button>
                </form>
            </div>
        );
    }
}
