export class User {
    username: string

    constructor(username: string) {
        this.username = username
    }
}

export interface UserCredentials {
    username: string,
    password: string
}