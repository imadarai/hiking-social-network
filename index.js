//////////////////////////////--EXPRESS--//////////////////////////////////////
const express = require('express');
const app = express();
const compression = require('compression');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('./utils/db.js');
// const { hash, compare } = require("./utils/bc.js");
////////////////////////////--Cookie Session/////////////////////////////////////
var cookieSession = require('cookie-session');
////////////////////////////////--CSRF----/////////////////////////////////////
const csurf = require('csurf');
////////////////////////////--SES Send Email-/////////////////////////////////////
// const { sendEmail } = require('./ses.js');
/////////////////////////--RESET PASSWORD CODE-//////////////////////////////////
// const cryptoRandomString = require('crypto-random-string');
/////////////////////////--Socket IO Requirements-//////////////////////////////////
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

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

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
//                              ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
//////////////////////////--WELCOME.JS ROUTING--///////////////////////////////
app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});


exports.app = app;
require("./routes/auth");
require("./routes/profile");
require("./routes/users");
require("./routes/friends");

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
server.listen(8080, function() {
    console.log("Social Network is up!");
});
////////////////////////////////////////////////////////////////////////////////
//                      socket.io event listenerm                             //
// /////////////////////////////////////////////////////////////////////////////
const onlineUsers = {};
async function whoIsOnline(socketid, userid) {
    if (arguments.length == 2) {
        onlineUsers[socketid] = userid;
    } else if (arguments.length == 1) {
        delete onlineUsers[socketid];
    }
    let onlineUsersArr = Object.values(onlineUsers);
    let distinctUsers = [...new Set(onlineUsersArr)];
    let onlineUsersInfo = await database.getOnlineUsers(distinctUsers);
    io.sockets.emit("onlineUsers", onlineUsersInfo.rows);
}

io.on("connection", socket => {
    console.log(`Socket with id ${socket.id} just connected`);
    socket.on("disconnect", function() {
        console.log(`Socket with id ${socket.id} disconnected`);
        whoIsOnline(socket.id);
    });
    socket.on("onlineUsers", async () => {
        whoIsOnline(socket.id, socket.request.session.userId);
    });

    database.getMostRecentChatMsgs()
        .then(results => {
            socket.emit("chatMessages", results.rows.reverse());
        })
        .catch(err => {
            console.log(err);
        });
    socket.on("chatMessage", async msg => {
        try {
            const newMsgId = await database.updateChat(
                msg,
                socket.request.session.userId
            );
            const newMsgInfo = await database.checkChatUpdate(newMsgId.rows[0].id);
            io.sockets.emit("chatMessage", newMsgInfo.rows[0]);
        } catch (e) {
            console.log(e);
        }
    });
});
