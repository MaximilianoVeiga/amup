const short = require("short-uuid");

class Token {
    constructor(token) {
        this.token = token;
    }

    static generate() {
        return short.generate();
    }
}

module.exports = Token;
