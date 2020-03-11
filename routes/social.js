const { app } = require('../index');
const { getFriendshipStatus, makeFriendRequest,
    acceptFriendRequest, deleteFriendship,
    getRecentUsers, getUsers
} = require('../libs/db');

app.get("/initial-friendship-status/:id", async (req, res) => {
    // console.log("GET /initial-friendship-status/ request received");
    const id = req.session.user.id;
    const otherUserId = req.params.id;
    const { rows } = await getFriendshipStatus(id, otherUserId);

    if (!rows[0]) {
        // no friendship
        return res.json({
            buttonText: "Make Friend Request"
        });
    }

    if (rows[0].accepted) {
        // friendship exists
        return res.json({
            buttonText: "End Friendship"
        });
    }

    if (rows[0].sender_id == id) {
        return res.json({
            buttonText: "Cancel Friend Request"
        });
    }

    if (rows[0].receiver_id == id) {
        return res.json({
            buttonText: "Accept Friend Request"
        });
    }

});

app.post("/make-friend-request/:id", async (req, res) => {
    try {
        const id = req.session.user.id;
        const otherUserId = req.params.id;
        const { rows } = await makeFriendRequest(id, otherUserId);
        res.json({buttonText: "Cancel Friend Request"});
    } catch (e) {
        console.log("error in makeFriendRequest:", e);
    }
});

app.post("/accept-friend-request/:id", async (req, res) => {
    try {
        const id = req.session.user.id;
        const otherUserId = req.params.id;
        const { rows } = await acceptFriendRequest(id, otherUserId);
        res.json({buttonText: "End Friendship"});
    } catch (e) {
        console.log("error in addFriendRequest:", e);
    }
});

app.post("/end-friendship/:id", async (req, res) => {
    try {
        const id = req.session.user.id;
        const otherUserId = req.params.id;
        const { rows } = await deleteFriendship(id, otherUserId);
        res.json({buttonText: "Make Friend Request"});
    } catch (e) {
        console.log("error in deleteFriendship:", e);
    }
});

app.get("/recent-users", async (req, res) => {
    console.log("GET /recent-users req received");
    try {
        const { rows } = await getRecentUsers();
        res.json(rows);
    } catch (e) {
        console.log("error in getRecentUsers:", e);
    }
});

app.post("/users", async (req, res) => {
    const { name } = req.body;
    try {
        const { rows } = await getUsers(name);
        res.json(rows);
    } catch (e) {
        console.log("error in getUsers:", e);
    }
});
