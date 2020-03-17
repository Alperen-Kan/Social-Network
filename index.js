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
    getUserById, insertChatMessage, getLastTenChatMessages
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


io.on('connection', socket => {
    console.log(
        `A socket with the id ${socket.id} just connected.`
    );
    console.log("socket.request.session.user.id:", socket.request.session.user.id);
    if (!socket.request.session.user.id) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.user.id;

    // if a user make it here, it means they have logged into our network
    // and they have successfully connected to the sockets

    // it is a good time to go and get the last 10 chat messages
    // that means we need to make a new table

    // getLastTenChatMessages probably needs to use a join.
    // join users and chats...

    getLastTenChatMessages().then( ({rows}) => {
        console.log("rows:", rows);
        socket.emit("chatMessages", rows.reverse());
    });

    // we need to listen for a new chat message being emitted..

    // socket.on("muffin", myMuffin => {
    //     console.log("myMuffin on the server:", myMuffin);
    //
    //     // emit a message to everyone connected to the social network.
    //     io.sockets.emit("muffinMagic", myMuffin);
    // });

    socket.on("newMessage", newMsg => {
        console.log("newMessage from chat.js component:", newMsg);
        // we would want to look up the user that sent the message
        console.log("userId in newMessage:", userId);

        // we want to do a db query to store the new chat message into chat table.
        // we want to build up a chat message object (that looks like chat message)
        // object we logged in getLastTenChatMessages
        // do a db query to look up info about user.
        // When we have done that we want to emit our message obj to everyone
        Promise.all([insertChatMessage(newMsg, userId), getUserById(userId)])
            .then(results => {
                console.log("Promise.all results[0]", results[0]);
                console.log("Promise.all results[1]", results[1].rows);
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
});

// io.on('connection', socket => {
//     // runs if client is connected
//     console.log(
//         `A socket with the id ${socket.id} just connected.`
//     );
//
//     socket.emit('hello', {
//         message: 'Thank you. It is great to be here.'
//     });
//
//     socket.on('disconnect', () => {
//         console.log(
//             `A socket with the id ${socket.id} just disconnected.`
//         );
//     });
// });
