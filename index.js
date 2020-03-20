const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(
    server,
    { origins: 'localhost:8080 mysocialnetworkapp.herokuapp.com:*' }
);
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const compression = require('compression');
const {
    getUserById, insertChatMessage, getLastTenChatMessages, getPrivateMessages, insertPrivateMessage
} = require('./libs/db');


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

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use((req, res, next) => {
    res.set('x-frame-options', 'DENY');
    res.cookie('csrftoken', req.csrfToken());
    next();
});

app.use((req, res, next) => {
    if (!req.session.user &&
        !req.url.startsWith('/welcome') &&
        req.url != '/registration' &&
        req.url != '/login' &&
        req.url != '/password/reset/start' &&
        req.url != '/password/reset/verify' &&
        req.url != '/logout'
    ) {
        return res.redirect('/welcome');
    } else {
        next();
    }
});

exports.app = app;

require("./routes/auth");
require("./routes/profile");
require("./routes/social");

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// socket.io //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

let listOfOnlineUsers = {};
let usersOnline = [];

io.on('connection', socket => {
    console.log(
        `A socket with the id ${socket.id} just connected.`
    );
    console.log("socket.request.session.user.id:", socket.request.session.user.id);
    if (!socket.request.session.user.id) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.user.id;

    if (!Object.values(listOfOnlineUsers).includes(userId)) {
        console.log("user was not online before");
        getUserById(userId).then(({rows}) => {
            usersOnline.push(rows[0]);
            console.log("usersOnline:", usersOnline);
            socket.emit("usersOnline", usersOnline);
            socket.broadcast.emit("userIsOnline", rows[0]);
        });
    }

    // if user disconnects, emit message that user is offline
    socket.on("disconnect", () => {
        console.log(`user with userId ${userId} disconnected`);
        delete listOfOnlineUsers[socket.id];
        console.log("usersOnline after disconnect:", listOfOnlineUsers);
        if (!Object.values(listOfOnlineUsers).includes(userId)) {
            getUserById(userId).then(({rows}) => {
                usersOnline = usersOnline.filter(user => user.id != userId);
                socket.broadcast.emit("userIsOffline", rows[0]);
            });
        }
    });

    listOfOnlineUsers[socket.id] = userId;
    console.log("listOfOnlineUsers:", listOfOnlineUsers);

    getLastTenChatMessages().then( ({rows}) => {
        socket.emit("chatMessages", rows.reverse());
    });

    // we need to listen for a new chat message being emitted..
    socket.on("newMessage", newMsg => {
        Promise.all([insertChatMessage(newMsg, userId), getUserById(userId)])
            .then(results => {
                const created_at = results[0].rows[0]["created_at"];
                const messageId = results[0].rows[0]["id"];
                const user = results[1].rows[0];
                io.sockets.emit("chatMessage", {
                    userId: userId,
                    first: user.first,
                    last: user.last,
                    url: user.url,
                    messageId: messageId,
                    message: newMsg,
                    created_at: created_at
                });
            })
            .catch(error => console.log("error in Promise.all:", error));
    });

    socket.on("privateMessages", otherUserId => {
        console.log("request for privateMessages received:", otherUserId);
        getPrivateMessages(userId, otherUserId).then( ({rows}) => {
            socket.emit("privateMessages", rows);
        }).catch(error => console.log("error in getPrivateMessages:", error));
    });

    socket.on("privateMessage", privateMsg => {
        const receiver_id = privateMsg.receiver_id;
        const message = privateMsg.message;
        console.log("privateMessage received:", privateMsg);
        Promise.all([insertPrivateMessage(message, userId, receiver_id), getUserById(userId)])
            .then(results => {
                var created_at = results[0].rows[0]["created_at"];

                const messageId = results[0].rows[0]["id"];
                const user = results[1].rows[0];

                for (const socketId in listOfOnlineUsers) {
                    if (
                        listOfOnlineUsers[socketId] == receiver_id ||
                        listOfOnlineUsers[socketId] == userId
                    ) {
                        io.sockets.sockets[socketId].emit('privateMessage', {
                            userId: userId,
                            first: user.first,
                            last: user.last,
                            url: user.url,
                            messageId: messageId,
                            message: message,
                            created_at: created_at
                        });
                    }
                }
            }).catch(error => console.log("error in Promise.all:", error));
    });

    socket.on("friendRequestUpdate", otherUserId => {
        for (const socketId in listOfOnlineUsers) {
            if (
                listOfOnlineUsers[socketId] == otherUserId ||
                listOfOnlineUsers[socketId] == userId

            ) {
                io.sockets.sockets[socketId].emit('friendRequestUpdate');
            }
        }
    });

});
