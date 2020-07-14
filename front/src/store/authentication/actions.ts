import { ActionTree } from "vuex";

import { RootState } from "../index";
import { AuthState } from "./state";

import { UserCredentials, RoleEnum } from "../../core/types";
import { authenticationService } from "../../core/services";

const actions: ActionTree<AuthState, RootState> = {
    
    /**
     * Login method.
     * @param param                         -- action params.
     * @param data                          -- login form data.
     */
    async login({ commit, dispatch }, data: { credentials: UserCredentials, rememberMe: boolean }): Promise<void> {
        const response = await authenticationService.login(data.credentials, data.rememberMe);
        if (!response) {
            throw new Error("Authentication failed.");
        }

        // retrieve token and scope from response
        if (!response.token) {
            throw new Error("Token not found.");
        }

        // save it on browser local storage
        authenticationService.setToken(response.token);

        // store it on vuex store
        commit("authenticate", { token: response.token, user: response.user });

        // // request context from backend
        // const context: Context = await authenticationService.context();

        // // save it on vuex store
        // commit("context", { context });
        
        // redirect depending on user role
        await dispatch("redirect");
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async logout({ commit }): Promise<void> {
        // clear browser local storage
        await authenticationService.logout();
        
        // clear vuex store
        commit("logout");

        // send back to login
        await this.$router.replace({ name: "login" });
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async redirect({ dispatch, state }): Promise<void> {
        if (state.user?.role?.key !== RoleEnum.UNKOWN) {
            await this.$router.push({ name: "index" });
        } else {
            await dispatch("logout");
        }
    },

    /**
     * Verify local storage when page reloads.
     * @param param                         -- action params.
     */
    async autoLogin({ state, commit, dispatch }): Promise<void> {
        // check if user is already authenticated
        if (state.token) return;

        // retrieve token and role from browser local storage
        const token: string | null = authenticationService.getToken();

        // check if user was logged in
        if (!token) return;

        // request context from backend
        const user = await authenticationService.context();

        // store it on vuex store
        commit("authenticate", { token, user: user });

        // redirect depending on user role
        await dispatch("redirect");
    },

    /**
     * Logout after token expires.
     * @param param                         -- action params.
     * @param expires                       -- expiration time to auto logout.
     */
    autoLogout({ commit }, expires: number): void {
        setTimeout(() => {
            commit("logout");
        }, expires);
    }

};

export default actions;
