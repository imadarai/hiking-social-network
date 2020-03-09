import React from "react";

export default function( { first, last, profilePic, bioEditor } ) {

    return (
        <div>
            {profilePic}
            <p>{first} {last}</p>
            {bioEditor}
        </div>
    );
}
