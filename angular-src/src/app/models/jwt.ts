export interface Jwt {
    name: string;
    email: string;
    username: string;
    sub: string;
    iat: number;
    exp: number;
}