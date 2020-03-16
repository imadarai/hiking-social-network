const spicedPg = require('spiced-pg');
// const secrets = require('./secrets');

///////////////////////////////////////////////////////////////////////////////
//                 DATABASE PORTS FOR LOCAL AND HEROKU                       //
///////////////////////////////////////////////////////////////////////////////

const db = spicedPg(process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/socialnetwork`);


///////////////////////////////////////////////////////////////////////////////
//                                 CREATE USER                               //
///////////////////////////////////////////////////////////////////////////////
module.exports.createUser = function (first, last, email, hashedPassword) {
    return db.query(
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first, last, email',
        [first, last, email, hashedPassword],
    );
};
///////////////////////////////////////////////////////////////////////////////
//                              GET USER BY ID                               //
///////////////////////////////////////////////////////////////////////////////
module.exports.getUserByID = function(id) {
    return db.query(
        `SELECT first, last, email, image_url, bio FROM users WHERE id = $1`,
        [id]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                     INSERT PROFILE PIC FROM S3 UPLOAD                     //
///////////////////////////////////////////////////////////////////////////////
module.exports.insertProfilePic = function (id, url) {
    return db.query(
        `UPDATE users SET image_url = $2 WHERE id = $1`,
        [id, url]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                                UPDATE USER BIO                            //
///////////////////////////////////////////////////////////////////////////////
module.exports.updateUserBio = function(id, bio) {
    return db.query(
        `UPDATE users SET bio = $2 WHERE id = $1 RETURNING bio`,
        [id, bio]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                                 Get Password                              //
///////////////////////////////////////////////////////////////////////////////
module.exports.getPassword = function(email) {
    return db.query(
        `SELECT id, first, last, password FROM users WHERE email = $1`,
        [email]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                       SELECT USERT FOR RESET PASS                         //
///////////////////////////////////////////////////////////////////////////////
module.exports.selectUserToResetPass = function(email) {
    return db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                 INSERT SECRET CODE IN PASSWORD_RESET_CODE                 //
///////////////////////////////////////////////////////////////////////////////!
module.exports.insdertSecretCode = function(email, code) {
    return db.query(
        `INSERT INTO password_reset_codes (email, code) VALUES ($1, $2)`,
        [email, code]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                 MATCH SECRET CODE ENTERE ON PASSWORD RESET                 //
///////////////////////////////////////////////////////////////////////////////!
module.exports.secretCodeMatch = function(code) {
    return db.query(
        `SELECT id FROM password_reset_codes
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND code =$1`,
        [code]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                 UPDATE PASSWORD UPON CODE MATCH                 //
///////////////////////////////////////////////////////////////////////////////!
module.exports.updatePassword = function(email, hashpassword) {
    return db.query(
        `UPDATE users SET password = $2 WHERE email = $1`,
        [email, hashpassword]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                         GetLatestUsers for Search                        //
///////////////////////////////////////////////////////////////////////////////!
module.exports.getLatestUsers = function getLatestUsers(userid) {
    return db.query(
        `SELECT id, first, last, image_url FROM users WHERE id!=$1
        ORDER BY id DESC LIMIT 6`,
        [userid]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                               userSearch                                   //
///////////////////////////////////////////////////////////////////////////////!
module.exports.searchUsers = function searchUsers(id, name) {
    return db.query(
        `SELECT id, first, last, image_url FROM users
        WHERE (first ILIKE $2
        OR last ILIKE $2
        OR email = $3)
        AND (users.id <> $1)
        ORDER BY last
        LIMIT 10`,
        [id, `%${name}%`, name]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                              Friendship Request                           //
///////////////////////////////////////////////////////////////////////////////!
module.exports.getFriendship = function getFriendship(requestId, userId) {
    return db.query(
        `SELECT * FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR receiver_id=$2 AND sender_id=$1`,
        [requestId, userId]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                                 checkRequest                               //
///////////////////////////////////////////////////////////////////////////////!
module.exports.checkRequestStatus = function checkRequestStatus( requestId, userId) {
    return db.query(
        `SELECT EXISTS (SELECT id FROM friendships WHERE receiver_id=$1 AND sender_id=$2
        OR receiver_id=$2 AND sender_id=$1)`,
        [requestId, userId]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                              Send Friend Request                          //
///////////////////////////////////////////////////////////////////////////////!
module.exports.sendFriendRequest = function sendFriendRequest(requestId, userId) {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES($1, $2)`,
        [requestId, userId]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                              Send Friend Request                          //
///////////////////////////////////////////////////////////////////////////////!
module.exports.establishFriendship = function establishFriendship(requestId, userId) {
    return db.query(
        `UPDATE friendships SET accepted = true
        WHERE receiver_id=$2 AND sender_id=$1`,
        [requestId, userId]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                            Delete Friend Request                          //
///////////////////////////////////////////////////////////////////////////////!
module.exports.deleteFriendship = function deleteFriendship(requestId, userId) {
    return db.query(
        `DELETE FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR receiver_id=$2 AND sender_id=$1`,
        [requestId, userId]
    );
};
