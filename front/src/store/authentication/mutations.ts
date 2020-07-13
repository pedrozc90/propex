import { MutationTree } from "vuex";

import { AuthState } from "./state";
import { User, Role } from "../../core/types";

const mutation: MutationTree<AuthState> = {
    
    /**
     * Mutate authentication state by uploading token and scope.
     * @param state                         -- module state.
     * @param payload                       -- mutation payload.
     */
    authenticate(state: AuthState, payload: { token: string; scope: Role }): void {
        state.token = payload.token;
        state.scope = payload.scope;
    },

    /**
     * Mutate authentication state by saving user information.
     * @param state                         -- module state.
     * @param payload                       -- mutation payload.
     */
    context(state: AuthState, payload: { user: User }): void {
        state.user = payload.user;
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

export default mutation;
