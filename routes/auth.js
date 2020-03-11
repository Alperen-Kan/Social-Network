const { app } = require('../index');
const { hash, compare } = require('../libs/bcrypt');
const { sendEmail } = require("../aws/ses");
const cryptoRandomString = require('crypto-random-string');
const {
    insertUser, getUserByEmail, insertCode, getCode, updatePw
} = require('../libs/db');

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

app.post("/login", async (req, res) => {
    console.log("login request received");

    const { email, password } = req.body;
    const { rows } = await getUserByEmail(email);

    if (!rows[0]) {
        // no such user
        res.json({error: "user doesn't exist"});
    } else {
        // user exists
        const pass = await compare(password, rows[0].password);
        console.log("pass:", pass);
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
    }
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
