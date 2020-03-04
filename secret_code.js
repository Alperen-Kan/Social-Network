const cryptoRandomString = require('crypto-random-string');

exports.secretCode = cryptoRandomString({
    length: 6
});
