export class User {
    userId: number
    username: string

    constructor(id: number, username: string) {
        this.userId = id
        this.username = username
    }
}

export interface UserCredentials {
    username: string,
    password: string
}