import { GetterTree } from "vuex";

import { RootState } from "../index";
import { AuthState } from "./state";
import { Role, RoleEnum } from "../../core/types";

const getters: GetterTree<AuthState, RootState> = {
    
    /**
     * Get token from store.
     * @param state                         -- store state
     */
    token(state: AuthState): string | undefined {
        return state.token;
    },

    /**
     * Get scope from store.
     * @param state                         -- store state
     */
    scope(state: AuthState): Role | undefined {
        return state.scope;
    },

    /**
     * Check if user is already authenticated.
     * @param state                         -- store state
     */
    isAuthenticated(state: AuthState): boolean {
        return (!!state.token);
    },

    /**
     * Check if scope is admin.
     * @param state                         -- store state
     */
    isAdmin(state: AuthState): boolean {
        return (state.user?.role?.key === RoleEnum.ADMIN);
    },

    /**
     * Check if scope is member.
     * @param state                         -- store state
     */
    isMember(state: AuthState): boolean {
        return (state.user?.role?.key === RoleEnum.MEMBER);
    },

    /**
     * Check if scope is unknown.
     * @param state                         -- store state
     */
    isNoob(state: AuthState): boolean {
        return (state.user?.role?.key === RoleEnum.UNKOWN);
    }

};

export default getters;
