// src/Welcome.js
import React from 'react';
import Registration from "./registration";
import { HashRouter, Route } from 'react-router-dom';
import Login from './login';
import ResetPassword from './reset';


export default function Welcome() {
    return (
        <div>
            <h1>Welcome to my socialnetwork! </h1>
            <HashRouter>
                <div>
                    <Route exact component={Registration} path="/" />
                    <Route component={Login} path="/login" />
                </div>
            </HashRouter>
        </div>
    );
}
// <Route component={ResetPassword} path="/reset" />
