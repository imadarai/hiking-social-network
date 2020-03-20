// src/Welcome.js
import React from 'react';
import Registration from "./registration";
import { HashRouter, Route } from 'react-router-dom';
import Login from './login';
import ResetPassword from './reset';


export default function Welcome() {
    return (
        <div className = "welcome-main ">
            <div className ="left-auth-container animated fadeInLeft">
                <div className="welcome-logo"></div>
                <h2>Adventure Of a Lifetime Awaits</h2>
                <HashRouter>
                    <div>
                        <Route exact component={Registration} path="/" />
                        <Route component={Login} path="/login" />
                        <Route exact component={ResetPassword} path="/reset" />
                    </div>
                </HashRouter>
            </div>
            <div className ="image-container animated fadeInRight">

            </div>
        </div>
    );
}
