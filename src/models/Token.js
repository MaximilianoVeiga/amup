import short from "short-uuid";

export default class Token {
    constructor(token) {
        this.token = token;
    }

    static generate() {
        return short.generate();
    }
}
