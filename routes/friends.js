const { app } = require('../index');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('../utils/db.js');

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
                buttonText: "Accept"    });
        }
    } catch (err) {
        console.log("Err in /friendships/:id request on server side: ", err);
    }
});
////////////////////////--Friendship Status POST--//////////////////////////////
app.post("/friendStatus/:id", async (req, res) => {
    try {
        const statusCheck = await database.checkRequestStatus(req.params.id,req.session.userId);
        if (req.body.friendship == false) {
            if (statusCheck.rows[0].exists == false) {
                await database.sendFriendRequest(req.params.id,req.session.userId);
                res.json({
                    friendship: "cancel",
                    buttonText: "Cancel Request"
                });
            }
        } else if ( req.body.friendship === 'cancel' ) {
            await database.deleteFriendship(req.params.id, req.session.userId);
            res.json({
                friendship: false,
                buttonText: "Connect"
            });
        } else if (req.body.friendship === "pending") {
            await database.establishFriendship(req.params.id, req.session.userId);
            res.json({
                friendship: true,
                buttonText: "Disconnect"
            });
        }
        else if (req.body.friendship === true) {
            await database.deleteFriendship(req.params.id, req.session.userId);
            res.json({
                friendship: false,
                buttonText: "Connect"
            });
        }
    } catch (err) {
        console.log("Err in post / friendship/:id request", err);
    }
});
