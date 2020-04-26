import { IAuthOptions } from "@tsed/common";

import { User } from "../entities";

// --------------------------------------------------
// GENERAL:
// --------------------------------------------------
export interface IOptions {
    page?: number;
    rpp?: number;
    q?: string;
}

export interface IEntity {
    id?: number | string;
}

export interface IContext {
    user?: User;
}

// --------------------------------------------------
// AUTHENTICATION:
// --------------------------------------------------
export interface IJwt {
    id?: number | string;
    email?: string;
    iat?: number;
    exp?: number;
}

export interface IToken {
    token?: string;
}

export interface ICustomAuthOptions extends IAuthOptions {
    role?: string;
    scope?: string[];
}
