import { RouteConfig } from "vue-router";
import { Role } from "../core/types";

interface Metadata {
    authorize?: Role[];
}

export interface CustomRouteConfig extends RouteConfig {
    meta?: Metadata
}

const routes: RouteConfig[] = [
    { path: "/login", name: "login", component: () => import("pages/login/Login.vue") },
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            { path: "", name: "index", component: () => import("pages/Index.vue") }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    { path: "*", component: () => import("pages/Error404.vue") }
];

export default routes;
