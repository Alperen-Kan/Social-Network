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
    // runs if client is connected
    console.log(
        `A socket with the id ${socket.id} just connected.`
    );

    socket.emit('hello', {
        message: 'Thank you. It is great to be here.'
    });

    socket.on('disconnect', () => {
        console.log(
            `A socket with the id ${socket.id} just disconnected.`
        );
    });
});
