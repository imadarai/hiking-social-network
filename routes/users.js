const { app } = require('../index');
////////////////////////////////--UTILS--//////////////////////////////////////
const database = require('../utils/db.js');

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
