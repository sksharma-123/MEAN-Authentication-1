export interface Tokens {
    accessToken: string;
    refreshToken: string;
    user: TokenUser
}

export interface TokenUser {
    id: string;
    name: string;
    username: string;
    email: string;
}