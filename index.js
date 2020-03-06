const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const compression = require('compression');
const { hash, compare } = require('./libs/bcrypt');
const { sendEmail } = require("./aws/ses");
const cryptoRandomString = require('crypto-random-string');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require("./aws/s3");
const config = require("./config");

const {
    insertUser, getUserById, getUserByEmail, insertCode, getCode, updatePw,
    updateImage, updateBio
} = require('./libs/db');

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

app.use(compression());

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

app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 365
}));

app.use(csurf());

app.use((req, res, next) => {
    res.set('x-frame-options', 'DENY');
    res.cookie('csrftoken', req.csrfToken());
    next();
});




// app.post("/registration", (req, res) => {
//
//     const {first, last, email, password} = req.body.data;
//     hash(password)
//         .then(hashedPw => {
//             insertUser(first, last, email, hashedPw)
//                 .then( ({rows}) => {
//                     console.log("insertUser successfull");
//                     console.log("id:", rows[0]);
//                     res.json({
//                         id: rows[0]
//                     });
//                 })
//                 .catch(error => console.log("error in insertUser:", error));
//         }).catch(error => console.log("error in hash:", error));
// });

app.post("/registration", async (req, res) => {

    const {first, last, email, password} = req.body.data;
    try {
        const hashedPw = await hash(password);
        const { rows } = await insertUser(first, last, email, hashedPw);
        req.session.user = {
            id: rows[0].id
        };
        res.json({success: true});
    } catch (error) {
        console.log(error.message);
        res.json({success: false});
    }
});

app.post("/login", (req, res) => {
    console.log("login request received");

    const { email, password } = req.body.data;
    getUserByEmail(email).then( ({rows}) => {
        if (!rows[0]) {
            // no such user
            res.json({error: "user doesn't exist"});
        } else {
            // user exists
            compare(password, rows[0].password)
                .then(pass => {
                    if (pass) {
                        // correct password
                        // login successfull
                        req.session.user = {
                            id: rows[0].id
                        };
                        console.log("req.session.user:", req.session.user);

                        res.json({success: true});
                    } else {
                        // wrong password
                        res.json({error: "wrong password"});
                    }
                });
        }
    }).catch(error => console.log("error in selectUser:", error));
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    console.log("pw reset start:", email);
    getUserByEmail(email)
        .then( ({rows}) => {
            console.log("rows:", rows);
            if (rows[0]) {
                // user exists
                console.log("user exists");
                // generate secret code
                const secretCode = cryptoRandomString({
                    length: 6
                });
                console.log("secret code:", secretCode);
                // insert code into db
                insertCode(secretCode, email)
                    .then(() => {
                        console.log("code has been inserted");
                        // send email
                        sendEmail(email, "Verify password reset", secretCode);

                        res.json({success: true});
                    })
                    .catch(error => console.log("error in insertCode:", error));
            } else {
                // user does not exist
                res.json({
                    error: "user does not exist"
                });
            }
        })
        .catch(error => console.log("error in selectUser:", error));
});

app.post("/password/reset/verify", (req, res) => {
    const { email, code, password } = req.body.data;
    // console.log("verify req.body.data:", req.body.data);
    // res.sendStatus(200);
    // db query to get code by email
    getCode(email)
        .then( ({rows}) => {
            console.log("getCode:", rows);
            if (rows[0]) {
                if (code === rows[0].code) {
                    // hash new password
                    hash(password)
                        .then(hashedPw => {
                            // update password
                            updatePw(email, hashedPw)
                                .then(() => {
                                    // send success message
                                    res.json({
                                        success: true
                                    });
                                })
                                .catch(error => console.log("error in updatePw:", error));
                        })
                        .catch(error => console.log("error in hash:", error));

                } else {
                    // inserted wrong code
                    console.log("wrong code");
                    res.json({
                        error: "wrong code"
                    });
                }
            } else {
                // code expired
                console.log("code expired");
                res.json({
                    error: "code expired"
                });
            }
        })
        .catch(error => console.log("error in getCode:", error));
});

app.get("/user", (req, res) => {
    console.log("GET /users req received");
    console.log("req.session.user:", req.session.user);
    getUserById(req.session.user.id)
        .then( ({rows}) => {
            console.log("getUserById:", rows);
            if (rows[0].url === null) {
                rows[0].url = "https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";
            }
            res.json(rows[0]);
        })
        .catch(error => console.log("error in getUserById:", error));
});

app.post("/user-image", uploader.single("file"), s3.upload, (req, res) => {
    console.log("input:", req.body);

    const { id } = req.body;
    const filename = req.file.filename;
    const url = config.s3Url + filename;
    console.log("filename:", filename);
    console.log("url:", url);

    updateImage(id, url)
        .then(() => {
            res.json({url: url});
        })
        .catch(error => console.log("error in updateImage", error));
});

app.post("/updatebio", (req, res) => {
    console.log("POST /updatebio req received");
    const { bio } = req.body;
    console.log("bio:", bio);
    updateBio(req.session.user.id, bio)
        .then( ({rows}) => {
            console.log("update bio was successfull");
            res.json({bio: rows[0].bio});
        })
        .catch(error => console.log("error in updateBio:", error));
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
