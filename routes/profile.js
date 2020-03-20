const { app } = require('../index');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('../utils/db.js');
///////////////////////////////////////////////////////////////////////////////
//                FILE UPLOAD BOILERPLATE CODE WITH MULTER                   //
// /////////////////////////////////////////////////////////////////////////////
const s3 = require("../s3.js");
const config = require("../config.json");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, `${process.cwd()}/uploads`);
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
