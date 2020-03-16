//////////////////////////////--EXPRESS--//////////////////////////////////////
const express = require('express');
const app = express();
const compression = require('compression');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('./utils/db.js');
const { hash, compare } = require("./utils/bc.js");
////////////////////////////--Cookie Session/////////////////////////////////////
var cookieSession = require('cookie-session');
////////////////////////////////--CSRF----/////////////////////////////////////
const csurf = require('csurf');
////////////////////////////--SES Send Email-/////////////////////////////////////
const { sendEmail } = require('./ses.js');
/////////////////////////--RESET PASSWORD CODE-//////////////////////////////////
const cryptoRandomString = require('crypto-random-string');
/////////////////////////--Socket IO Requirements-//////////////////////////////////
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });


///////////////////////////////////////////////////////////////////////////////
//                FILE UPLOAD BOILERPLATE CODE WITH MULTER                   //
// /////////////////////////////////////////////////////////////////////////////
const s3 = require("./s3.js");
const config = require("./config.json");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//////////////////////////////////////////////////
//      EXPRESS STATIC,COMPRESSION,JSON         //
// ///////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));
app.use(compression());
app.use(express.json());
//////////////////////////////////////////////////
//            EXPRESS URL ENCODED               //
// ///////////////////////////////////////////////
app.use(express.urlencoded({extended: false}));
//////////////////////////////////////////////////
//               COOKIE SESSION                 //
// ///////////////////////////////////////////////
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
//////////////////////////////////////////////////
//                   CSRF                      //
// ///////////////////////////////////////////////
app.use(csurf());
app.use((req, res, next) => {
    res.set('x-frame-options', 'DENY');
    res.cookie('mycsrftoken', req.csrfToken());
    next();
});
//////////////////////////////////////////////////
//                Bundle Server                 //
// ///////////////////////////////////////////////
if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////////////////////////////////////////////////////////////////////////////
//                              GET - ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
//////////////////////////--WELCOME.JS ROUTING--///////////////////////////////
app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
////////////////////////////////--LOUGOUT--/////////////////////////////////////
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});
/////////////////////////--APP.JS Get USER BY ID--///////////////////////////////
app.get("/user/info", async (req,res) => {
    try {
        let results = await database.getUserByID(req.session.userId);
        res.json({
            userId: req.session.userId,
            first: results.rows[0].first,
            last: results.rows[0].last,
            email: results.rows[0].email,
            profilePic: results.rows[0].image_url,
            bio: results.rows[0].bio
        });
    } catch(err) {
        console.log("ERR IN GETTING USER BY ID INDEX.JS: ", err);
    }
});
///////////////////--USERPROFILE Request 'other profile'--//////////////////////
app.get("/api/userprofile/:id", async (req,res) => {
    try {
        //if the user is tryign to go to their own page
        if (req.params.id == req.session.userId) {
            res.json({ error: true });
        }
        //if the provided route is not a number
        if (isNaN(req.params.id)) {
            res.json({
                error: true
            });
        }
        //if the req.param is an ID
        let {rows} = await database.getUserByID(req.params.id);
        res.json({
            userId: req.params.id,
            first: rows[0].first,
            last: rows[0].last,
            profilePic: rows[0].image_url,
            bio: rows[0].bio
        });
    } catch(err) {
        console.log("Err in Getting /userprofile/:id: ", err);
        res.json({
            error: true
        });
    }
});
/////////////////////////////--SEARCH USERS--//////////////////////////////////
app.get("/api/usersearch/:searchTerm?", async (req, res) => {
    let searchTerm = req.params.searchTerm;
    if (searchTerm === undefined) {
        try {
            const lastestUsers = await database.getLatestUsers(req.session.userId);
            res.json({ users: lastestUsers.rows });
        } catch (err) {
            console.log("Err in getLatestUsers DB request: ", err);
        }
    } else {
        try {
            const userArr = await database.searchUsers(
                Number(req.session.userId),
                searchTerm
            );
            res.json({ users: userArr.rows });
        } catch (err) {
            console.log("Err in searchUsers DB request: ", err);
        }
    }
});
/////////////////////////////--Friendship Status--//////////////////////////////////
app.get("/friendStatus/:id", async (req, res) => {
    try {
        const friendStatus = await database.getFriendship( req.params.id , req.session.userId );
        if (!friendStatus.rows[0]) {
            res.json({
                friendship: false,
                buttonText: "Connect"   });
        } else if (friendStatus.rows[0].accepted == true) {
            res.json({
                friendship: true,
                buttonText: "Disconnect"    });
        } else if (
            friendStatus.rows[0].accepted == false &&
            friendStatus.rows[0].sender_id == req.session.userId ) {
            res.json({
                friendship: "cancel",
                buttonText: "Cancel Request"    });
        } else if (
            friendStatus.rows[0].accepted == false &&
            friendStatus.rows[0].receiver_id == req.session.userId) {
            res.json({
                friendship: "pending",
                buttonText: "Accept",
                rejectText: "Decline",
                rejectFlag: "reject"   });
        }
    } catch (err) {
        console.log("Err in /friendships/:id request on server side: ", err);
    }
});
////////////////////////////////////////////////////////////////////////////////
//                              POST - ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
////////////////////////--Friendship Status POST--//////////////////////////////
app.post("/friendStatus/:id", async (req, res) => {
    try {
        if (req.body.friendship == false) {
            const statusCheck = await database.checkRequestStatus(req.params.id,req.session.userId);
            console.log(statusCheck);
            if (statusCheck.rows[0].exists == false) {
                await database.sendFriendRequest(req.params.id,req.session.userId);
                console.log("I'm in SendFriendRequest");
                res.json({
                    friendship: "cancel",
                    buttonText: "Cancel Request"
                });
            } else {
                await database.establishFriendship(req.params.id, req.session.userId);
                console.log("I'm in establishFrienship 1");
                res.json({
                    friendship: true,
                    buttonText: "Disconnect"
                });
            }
        } else if (
            req.body.friendship === true
        ) {
            await database.deleteFriendship(req.params.id, req.session.userId);
            console.log("I'm in deleteFrienship");
            res.json({
                friendship: false,
                buttonText: "Connect",
                rejectText: false,
                rejectFlag: false
            });
        } else if (req.body.friendship === "pending") {
            // establish friendship end send "end friendship"
            await database.establishFriendship(req.params.id, req.session.userId);
            console.log("I'm in establishFrienship 2");
            res.json({
                success: true,
                friendship: true,
                buttonText: "End Friendship"
            });
        }
    } catch (err) {
        console.log("error", err);
    }
});
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
///////////////////////--UPLOAD PROFILE PICTURE--///////////////////////////////
app.post("/user/update-profile-pic", uploader.single("file"), s3.upload, async (req, res) => {
    try {
        const {id} = req.body;
        const url = config.s3Url + req.file.filename;
        await database.insertProfilePic(id, url);
        res.json ({url: url});
    } catch (err) {
        console.log("Err in /insertProfilePic in index.js: ", err);
    }
});
/////////////////////////////--UPDATE BIO INFO--////////////////////////////////
app.post("/user/updatebio", async (req, res) => {
    try {
        const { newBio } = req.body;
        const {rows} = await database.updateUserBio(req.session.userId, newBio);
        res.json({bio: rows[0].bio});
    } catch (err) {
        console.log("Err in database.updateUserBio route in Index.js: ", err);
    }
});
////////////////////////////////////////////////////////////////////////////////
//                       \/DO NOT TOUCH OR CHANGE\/                           //
// /////////////////////////////////////////////////////////////////////////////
app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
////////////////////////////////////////////////////////////////////////////////
//                            Start the Engine                                //
// /////////////////////////////////////////////////////////////////////////////
app.listen(8080, function() {
    console.log("Social Network is up!");
});
////////////////////////////////////////////////////////////////////////////////
//                      socket.io event listenerm                             //
// /////////////////////////////////////////////////////////////////////////////
// io.on("connection", socket => {
//     //connected
//     console.log(
//         `A socket with the id ${socket.id} just connected`
//     );
//     socket.emit("hellow", {
//         message: "It is nice to see you"
//     });
//     socket.on('disconnect', () => {
//         console.log(
//             `A socket with the id ${socket.id} just disconnected`
//         );
//     });
// });
