import { ActionTree } from "vuex";

import { RootState } from "../index";
import { AuthState } from "./state";

import { UserCredentials } from "../../core/types";

const actions: ActionTree<AuthState, RootState> = {
    
    /**
     * Login method.
     * @param param                         -- action params.
     * @param data                          -- login form data.
     */
    async login({ state, commit, dispatch }, data: { credentials?: UserCredentials, rememberMe?: boolean }): Promise<void> {
        // if (!data.credentials) return;
        
        // const response = await authentication.login(data.credentials, data.rememberMe);

        // // retrieve token and scope from response
        // const token: string | undefined = response.token;
        // const scope: Role | undefined = response.role;

        // if (!token) {
        //     throw new Error("Token not found.");
        // }

        // // save it on browser local storage
        // authentication.setToken(token);
        // authentication.setScope(scope || Role.CRITTER);

        // // store it on vuex store
        // commit("authenticate", { token, scope });

        // // request context from backend
        // const context: Context = await authentication.context();

        // // save it on vuex store
        // commit("context", { context });
        
        // // redirect depending on user role
        // dispatch("redirect");
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async logout({ state, commit, dispatch }): Promise<void> {
        // // clear browser local storage
        // authentication.logout();

        // // clear vuex store
        // commit("logout");

        // // send back to login
        // router.replace({ name: "login" });
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async redirect({ state, commit, dispatch }): Promise<void> {
        // if (state.scope === Role.WORLD_BOSS || state.scope === Role.BOSS) {
        //     router.push({ name: "index" });
        // } else {
        //     dispatch("logout");
        // }
    },

    /**
     * Verify local storage when page reloads.
     * @param param                         -- action params.
     */
    async autoLogin({ state, commit, dispatch }): Promise<void> {
        // // check if user is already authenticated
        // if (state.token) return;

        // // retrieve token and role from browser local storage
        // const token: string | null = authentication.getToken();
        // const scope: Role | null = authentication.getScope();

        // // check if user was logged in
        // if (!token || !scope) return;

        // // store it on vuex store
        // commit("authenticate", { token, scope });

        // // redirect depending on user role
        // dispatch("redirect");
    },

    /**
     * Logout after token expires.
     * @param param                         -- action params.
     * @param expires                       -- expiration time to auto logout.
     */
    async autoLogout({ state, commit, dispatch }, expires: number): Promise<void> {
        // setTimeout(() => {
        //     commit("logout");
        // }, expires);
    }

};

export default actions;
