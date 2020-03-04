// src/Registration.js
import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor () {
        super ();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }
    ////////////////////////CAPTURING INPUT FIELDS/////////////////////////////
    handleChange (e) {
        this.setState ({
            [e.target.name]: e.target.value,
        });
    }
    registerUser (e) {
        e.preventDefault();
        console.log(this.state);

        if (this.state.first && this.state.last && this.state.email && this.state.password) {
            axios.post("/registration", this.state).then(function(response){
                console.log('Response from server after db.createUser', response.data);
                if (response.data.id) {
                    location.replace('/');
                }
            }).catch(err => {
                console.log("Err in axios POST request /registration: ", err);
                this.setState({error: "Email already exist.  Please login"});
            });
        }
        if (!this.state.first){
            this.setState({error: "First Name is required"});
        }
        if (!this.state.last){
            this.setState({error: "Last Name is required"});
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
                <h1>Registration</h1>
                <p> {this.state.error} </p>
                <form>
                    <input onChange={this.handleChange} name="first" type ="text" placeholder="First Name" required />
                    <input onChange={this.handleChange} name="last" type ="text" placeholder="Last Name" required/>
                    <input onChange={this.handleChange} name="email" type ="email" placeholder="Email" required/>
                    <input onChange={this.handleChange} name="password" type ="password" placeholder="Password" required/>
                    <button onClick={this.registerUser}>Register</button>
                </form>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}
