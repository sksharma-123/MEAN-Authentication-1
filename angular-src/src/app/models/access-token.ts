import { TokenUser } from "./tokens";

export interface AccessToken {
    token: string;
    user: TokenUser;
}