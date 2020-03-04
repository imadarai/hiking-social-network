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
        'INSERT INTO users (first, last, email, hash_password) VALUES ($1, $2, $3, $4) RETURNING id, first, last, email',
        [first, last, email, hashedPassword],
    );
};
///////////////////////////////////////////////////////////////////////////////
//                                 Get Password                              //
///////////////////////////////////////////////////////////////////////////////
module.exports.getPassword = function(email) {
    return db.query(
        `SELECT id, first, last, hash_password FROM users WHERE email = $1`,
        [email]
    );
};
