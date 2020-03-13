import React from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import { useState, useEffect } from "react";
import axios from "../axios";


export default function UserSearch() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        var abort;
        let searchTerm = search;
        axios.get(`/api/usersearch/${searchTerm}`).then(response => {
            if (!abort) {
                setUsers(response.data.users);
            }
        }).catch(err => console.log(err));
        return () => {
            abort = true;
        };
    },[search]
    );

    return (
        <div>
            <input className="search" onChange={e => setSearch(e.target.value)} defaultValue={search} type ="text" placeholder="Search Here"/>
            {users && (
                users.map(user => (
                    <div key={user.id}>
                        <Link to={`/userprofile/${user.id}`}>
                            <ProfilePic
                                first ={user.first}
                                last = {user.last}
                                url = {user.image_url}
                            />
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}
