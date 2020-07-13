import { User, Role } from "../../core/types";

export interface AuthState {
    token?: string;
    user?: User;
    scope?: Role;
}

const state: AuthState = {
    token: undefined,
    user: undefined,
    scope: undefined
};

export default state;
