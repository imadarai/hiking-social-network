import React from "react";

export default function({url, first, last, openUploader}) {
    return (
        <img className="profile-pic"
            src={url || "../images/profilepic.png"}
            alt={`${first} ${last}`}
            onClick={openUploader}
        />
    );
}
