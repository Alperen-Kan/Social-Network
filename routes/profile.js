const { app } = require('../index');
const s3 = require("../aws/s3");
const config = require("../config");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const {
    getUserById, updateImage, updateBio
} = require('../libs/db');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/../uploads');
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

app.get("/user", async (req, res) => {
    const { rows } = await getUserById(req.session.user.id);
    if (rows[0].url === null) {
        rows[0].url = "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";
    }
    res.json(rows[0]);
});

app.post("/user-image", uploader.single("file"), s3.upload, async (req, res) => {

    const { id } = req.body;
    const filename = req.file.filename;
    const url = config.s3Url + filename;

    updateImage(id, url)
        .then(() => {
            res.json({url: url});
        })
        .catch(error => console.log("error in updateImage", error));
});

app.post("/updatebio", (req, res) => {
    const { bio } = req.body;
    updateBio(req.session.user.id, bio)
        .then( ({rows}) => {
            res.json({bio: rows[0].bio});
        })
        .catch(error => console.log("error in updateBio:", error));
});

app.get("/user/:id.json", async (req, res) => {

    if (req.params.id == req.session.user.id) {
        return res.json({redirectTo: "/"});
    }

    const { rows } = await getUserById(req.params.id);
    if (!rows[0]) {
        return res.json({error: "userId does not exist"});
    }
    res.json(rows[0]);
});
