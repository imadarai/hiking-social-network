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
        `UPDATE users SET bio = $2 WHERE id = $1 Returning bio`,
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
