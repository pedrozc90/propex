/* eslint-disable @typescript-eslint/no-explicit-any */
import { route } from "quasar/wrappers";
import VueRouter from "vue-router";
import { RootState } from "../store";

import routes from "./routes";
import { Role } from "../core/types";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
export default route<RootState>(({ Vue, store }: any) => {
    Vue.use(VueRouter);

    const Router = new VueRouter({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,

        // Leave these as is and change from quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    });

    Router.beforeEach(async (to, from, next) => {
        // retrieve token from local storage to auto login
        await store.dispatch("authentication/autoLogin");

        const role: Role | undefined = store.getters["authentication/scope"];
        
        const isPublic: boolean = (!to.meta) || (!to.meta.authorize) || (to.meta.authorize.length === 0);
        const requiredAuth: boolean | undefined = to.meta?.authorize?.includes(role);
        
        if (!isPublic && !requiredAuth) {
            next({ name: "login" });
        }

        next();
    });

    return Router;
});
