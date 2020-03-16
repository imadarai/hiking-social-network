const { app } = require('../index');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('../utils/db.js');
const { hash, compare } = require("../utils/bc.js");
////////////////////////////--SES Send Email-/////////////////////////////////////
const { sendEmail } = require('../ses.js');
/////////////////////////--RESET PASSWORD CODE-//////////////////////////////////
const cryptoRandomString = require('crypto-random-string');



////////////////////////////////--LOGIN--/////////////////////////////////////
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    database.getPassword(email)
        .then(results =>{
            //Compare() to check if Password is correct
            //SETTING COOKIE INFORMATION
            req.session.userId = results.rows[0].id;
            req.session.first = results.rows[0].first;
            req.session.last = results.rows[0].last;
            compare(password, results.rows[0].password).then( results =>{
                if (results) {
                    //If result retrun True - forward to Petition
                    res.json(results);
                } else {
                    //if results return false - reload with error message
                    req.session = null;
                    res.redirect(500, "/login");
                }
                console.log("Is the password correct: ", results);
            }).catch(err => console.log("Err in password compare() : ", err));
        }).catch(err =>{
            console.log("Err in getPassword : ",err);
            res.redirect (500, "/login");
        });
});
////////////////////////////////--REGISTRATION--/////////////////////////////////////
app.post("/registration", (req, res) => {
    const {first, last, email, password} = req.body;
    hash(password)
        .then(hashedPassword => {
            database.createUser(first,last,email,hashedPassword)
                .then(response => {
                    // console.log("response.rows[0]", response.rows[0]);
                    req.session.userId = response.rows[0].id;
                    req.session.first = response.rows[0].first;
                    req.session.last = response.rows[0].last;
                    req.session.email = response.rows[0].email;

                    res.json(response.rows[0]);
                }).catch(err => {
                    res.redirect(500, "/welcome");
                    console.log("error in createUser DB request:", err);
                });
        }).catch(err => console.log("Err in hashing passowrd: ", err));
});
////////////////////////////////--RESET-PASS--/////////////////////////////////////
app.post("/resetpassword/start", (req, res) => {
    const { email } = req.body;
    database.selectUserToResetPass(email).then( results => {

        if (results.rows[0]) {
            const secretCode =  cryptoRandomString({length: 6});
            database.insdertSecretCode(email, secretCode)
                .then(() => {
                    let message = `We received a request to reset your password.  Here is your reset code: ${secretCode}`;
                    sendEmail(email, "Password Reset Code from Annapurna", message);
                    res.json({success: true});
                })
                .catch(err => console.log("Err in database.insdertSecretCode:", err));
        } else {
            res.redirect(500, "/reset");
        }
    }).catch(err =>{
        res.redirect(500, "/reset");
        console.log("error in selectUserToResetPass", err);
    });
});
app.post("/resetpassword/verify", (req, res) => {
    const {secretcode, email, password} = req.body;
    database.secretCodeMatch(secretcode).then(results => {
        if(results.rows[0]){
            hash(password)
                .then(hashedPassword => {
                    database.updatePassword(email,hashedPassword)
                        .then(() => {
                            res.json({success: true});
                        }).catch(err =>console.log("error in updatePassword DB request:", err));
                }).catch(err => console.log("Err in hashing passowrd on /resetpassword route: ", err));
        } else {
            res.redirect(500, "/reset");
        }
    }).catch(err =>console.log("error in secretCodeMatch", err));
});
////////////////////////////////--LOUGOUT--/////////////////////////////////////
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});
