const spicedPg = require('spiced-pg');

const db = spicedPg(
    process.env.DATABASE_URL ||
    `postgres://postgres:postgres@localhost:5432/socialnetwork`
);

exports.insertUser = function(first, last, email, password) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        Returning id
        `,
        [first, last, email, password]
    );
};

exports.getUserByEmail = function(email) {
    return db.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    );
};

exports.getUserById = function(id) {
    return db.query(
        `
        SELECT id, first, last, url, bio
        FROM users
        WHERE id = $1
        `,
        [id]
    );
};

exports.insertCode = function(code, email) {
    return db.query(
        `
        INSERT INTO password_reset_codes (code, email)
        VALUES ($1, $2)
        `,
        [code, email]
    );
};

exports.getCode = function(email) {
    return db.query(
        `
        SELECT code FROM password_reset_codes
        WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY id DESC
        LIMIT 1
        `,
        [email]
    );
};

exports.updatePw = function(email, password) {
    return db.query(
        `
        UPDATE users
        SET password = $2
        WHERE email = $1
        `,
        [email, password]
    );
};

exports.updateImage = function(id, url) {
    return db.query(
        `
        UPDATE users
        SET url = $2
        WHERE id = $1
        `,
        [id, url]
    );
};

exports.updateBio = function(id, bio) {
    return db.query(
        `
        UPDATE users
        SET bio = $2
        WHERE id = $1
        Returning bio
        `,
        [id, bio]
    );
};
