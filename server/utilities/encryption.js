var crypto = require('crypto');

module.exports = {
    generateSalt: function () {
        return crypto.randomBytes(128).toString('base64');
    },
    generateHashedText: function (salt, pwd) {
        var hmac = crypto.createHmac('sha1', salt);
        return hmac.update(pwd).digest('hex');
    },
    encrypt: function(text, key) {
        var cipher = crypto.createCipher('aes192', key);
        var result = cipher.update(text, 'binary', 'hex');
        return  (result + cipher.final('hex'));
    },
    decrypt: function(cipher, key) {
        var decipher = crypto.createDecipher('aes192', key);
        var decryptedData = decipher.update(cipher, 'hex', 'binary');
        return (decryptedData + decipher.final('binary'));
    }
};