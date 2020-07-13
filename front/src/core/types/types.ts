import { Role } from "./enum";

export interface UserCredentials {
    email?: string;
    password?: string;
}

export interface User extends UserCredentials {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    active?: boolean;
    createAt?: Date;
    updatedAt?: Date;
}
