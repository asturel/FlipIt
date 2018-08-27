const crypto = require('crypto'),
    uuidv1 = require('uuid/v1'),
    algorithm = 'aes-256-cbc',
    secret = 'lou1grYpkfKHQrRDLAZ0lfi5xgFU4OPm';

const tokens = [];

class Token {
    static create() {
        let id = uuidv1();
        while (tokens.includes(id)) {
            id = uuidv1();
        }
        tokens.push(id);
        return id;
    }

    static encrypt(id) {
        const cipher = crypto.createCipher(algorithm, secret);
        let encrypted = cipher.update(id, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(token) {
        const cipher = crypto.createDecipher(algorithm, secret);
        let decrypted = cipher.update(token, 'hex', 'utf-8');
        decrypted += cipher.final('utf-8');
        return decrypted;
    }
};

module.exports = Token;