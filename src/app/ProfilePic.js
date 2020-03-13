import React from "react";

export default function({url, first, last, openUploader}) {
    // const setDefaultUrl = (e) => {
    //     e.target.setAttribute("src", "../images/profilepic.png");
    // };

    return (
        <div>
            <img className="profile-pic"
                src={url || "../images/profilepic.png"}
                alt={`${first} ${last}`}
                onClick={openUploader}
            />
            <p>{`${first} ${last}`}</p>
        </div>
    );
}
