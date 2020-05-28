import React from "react";
import {Link} from "react-router-dom";

export default function () {

    return (
        <div className ="app-header animated fadeInDown">
            <div className="app-logo"></div>
            <div className="app-nav">
                <Link to="/usersearch"><button className="nav-button">Find Hikers</button></Link>
                <Link to="/friends"><button className="nav-button">My Buddies</button></Link>
                <Link to="/chat"><button className="nav-button">Global Chat</button></Link>
                <Link to="/logout"><button className="nav-button">Logout</button></Link>
            </div>
        </div>
    );
}
