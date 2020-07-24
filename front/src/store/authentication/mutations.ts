import { MutationTree } from "vuex";

import { AuthState } from "./state";
import { User } from "../../core/types";

const mutations: MutationTree<AuthState> = {
    
    /**
     * Mutate authentication state by uploading token and scope.
     * @param state                         -- module state.
     * @param payload                       -- mutation payload.
     */
    authenticate(state: AuthState, payload: { token: string; user: User }): void {
        state.token = payload.token;
        state.user = payload.user;
        state.scope = payload.user?.role;
    },

    /**
     * Mutate authentication state by saving user information.
     * @param state                         -- module state.
     * @param payload                       -- mutation payload.
     */
    context(state: AuthState, payload: { user: User }): void {
        state.user = payload.user;
        state.scope = payload.user?.role;
    },

    /**
     * Mutate authentication state by clean it.
     * @param state                         -- module state.
     */
    logout(state: AuthState): void {
        delete state.token;
        delete state.user;
        delete state.scope;
    }

};

export default mutations;
