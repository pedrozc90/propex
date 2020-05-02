import { IAuthOptions } from "@tsed/common";

import { User, Collaborator, Student } from "../entities";
import { Scope } from "./enums/Scope";

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
    user: User;
    collaborator?: Collaborator;
    student?: Student;
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
}

export interface ICustomAuthOptions extends IAuthOptions {
    role?: string;
    scope?: string[];
}
