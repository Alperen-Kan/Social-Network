const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const compression = require('compression');
const { hash, compare } = require('./bcrypt');
const { insertUser, getUser, insertCode, getCode, updatePw } = require('./db');
const { secretCode } = require("./secret_code");
const { sendEmail } = require("./ses");
const cryptoRandomString = require('crypto-random-string');

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


app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post("/registration", (req, res) => {

    const {first, last, email, password} = req.body.data;
    hash(password)
        .then(hashedPw => {
            insertUser(first, last, email, hashedPw)
                .then( ({rows}) => {
                    console.log("insertUser successfull");
                    console.log("id:", rows[0]);
                    res.json({
                        id: rows[0]
                    });
                })
                .catch(error => console.log("error in insertUser:", error));
        }).catch(error => console.log("error in hash:", error));
});

app.post("/login", (req, res) => {
    console.log("login request received");

    const { email, password } = req.body.data;
    getUser(email).then( ({rows}) => {
        if (!rows[0]) {
            // no such user
            res.json({
                error: "user doesn't exist"
            });
        } else {
            // user exists
            compare(password, rows[0].password)
                .then(pass => {
                    if (pass) {
                        // correct password
                        // login successfull
                        req.session.user = {
                            id: rows[0].id,
                            first: rows[0].first,
                            last: rows[0].last,
                            email: rows[0].email
                        };

                        res.json({
                            success: true
                        });
                    } else {
                        // wrong password
                        res.json({
                            error: "wrong password"
                        });
                    }
                });
        }
    }).catch(error => console.log("error in selectUser:", error));
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    console.log("pw reset start:", email);
    getUser(email)
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

                        res.json({
                            success: true
                        });
                    })
                    .catch(error => console.log("error in insertCode:", error));
            } else {
                // user does not exist
                res.json({
                    error: "user does not exist"
                })
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
                            })
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
                })
            }
        })
        .catch(error => console.log("error in getCode:", error));
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
