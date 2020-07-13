/* eslint-disable object-curly-newline */
import { store } from "quasar/wrappers";
import Vuex from "vuex";

import authentication from "./authentication";
import { AuthState } from "./authentication/state";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export interface RootState {
    authentication: AuthState
}

export default store(({ Vue }) => {
    Vue.use(Vuex);

    const Store = new Vuex.Store<RootState>({
        modules: {
            authentication
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: !!process.env.DEV
    });

    return Store;
});
