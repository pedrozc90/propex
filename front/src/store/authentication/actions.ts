import { ActionTree } from "vuex";

import { RootState } from "../index";
import state, { AuthState } from "./state";

import { UserCredentials } from "../../core/types";
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
        console.log("login", response);

        // retrieve token and scope from response
        if (!response.token) {
            throw new Error("Token not found.");
        }

        // keep token saved on browser local storage
        authenticationService.setToken(response.token);

        // mutate vuex state
        commit("authenticate", { token: response.token, user: response.user });

        // redirect depending on user role
        await dispatch("redirect");
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async logout({ commit }): Promise<void> {
        // clear browser local storage
        // await authenticationService.logout();
        
        // clear vuex store
        commit("logout");

        // send back to login
        await this.$router.push({ name: "login" });
    },

    /**
     * Logout method.
     * @param param                         -- action params.
     */
    async redirect({ dispatch, state }): Promise<void> {
        const role = state.user?.role;
        if (!role) {
            await dispatch("logout");
        } else {
            // await this.$router.push({ name: "index" });
            await this.$router.push({ name: "project", params: { id: "1" } });
        }
    },

    /**
     * Verify local storage when page reloads.
     * @param param                         -- action params.
     */
    async autoLogin({ commit, dispatch }): Promise<void> {
        if (state.token) return;

        // retrieve token and role from browser local storage
        const token: string | null = authenticationService.getToken();

        // return to the router guard
        if (!token) return;
        
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
