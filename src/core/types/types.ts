import { IAuthOptions } from "@tsed/common";

import { User } from "../../entities";
import { Context } from "../models";
import { Scope } from "./enums/Scope";

// --------------------------------------------------
// GENERAL:
// --------------------------------------------------
export interface IOptions {
    page?: number;
    rpp?: number;
    q?: string;
    context?: Context;
    [key: string]: any;
}

export interface IEntity {
    id?: number | string;
}

export interface IContext {
    user?: User;
    scope?: Scope;
}

// --------------------------------------------------
// AUTHENTICATION:
// --------------------------------------------------
export interface IJwt {
    id?: number;
    email?: string;
    iat?: number;
    exp?: number;
}

export interface IToken {
    token?: string;
    user?: User;
}

export interface IAuthenticatedOptions extends IAuthOptions {
    role?: string;
    scope?: string[];
}
