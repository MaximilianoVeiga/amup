import short from "short-uuid";

export default class Token {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    static generate(): string {
        return short.generate();
    }
}
