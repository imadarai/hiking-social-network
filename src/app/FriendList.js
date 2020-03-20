import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    getListOfFriends,
    endFriendship,
    acceptFriendship,
} from "../redux/actions";
import ProfilePic from "./ProfilePic";

function Friends(props) {
    useEffect(() => {
        props.dispatch(getListOfFriends());
    }, []);

    let disconnect = async userId => {
        props.dispatch(endFriendship(userId));
    };
    let accept = async userId => {
        props.dispatch(acceptFriendship(userId));
    };
    return (
        <div>
            <div>
                <p>Current Friends</p>
                {props.friends ? (
                    props.friends.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/userprofile/${friend.id}`}>
                                <ProfilePic
                                    first ={friend.first}
                                    last = {friend.last}
                                    url = {friend.profilePic}
                                />
                            </Link>
                            <button onClick={() => disconnect(friend.id)}>
                                Disconnect
                            </button>
                        </div>
                    ))
                ) : (
                    <p>You do not have any friendships</p>
                )}
            </div>
            <div>
                <p>Pending Friends</p>
                {props.pending ? (
                    props.pending.map(friend => (
                        <div key={friend.id}>
                            <Link to={`/userprofile/${friend.id}`}>
                                <ProfilePic
                                    first ={friend.first}
                                    last = {friend.last}
                                    url = {friend.profilePic}
                                />
                            </Link>
                            <button onClick={() => accept(friend.id)}>
                                Accept
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No pending friend requests</p>
                )}
            </div>
        </div>
    );
}
const mapStateToProps = function(state) {
    return {
        friends:
            state.friends &&
            state.friends.filter(friend => friend.accepted == true),
        pending:
            state.friends &&
            state.friends.filter(pending => pending.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
