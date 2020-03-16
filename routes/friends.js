const { app } = require('../index');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('../utils/db.js');


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
