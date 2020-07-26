import { RouteConfig } from "vue-router";
import { RoleEnum } from "../core/types";

interface Metadata {
    scope?: RoleEnum[];
}

export interface CustomRouteConfig extends RouteConfig {
    meta?: Metadata
}

const routes: RouteConfig[] = [
    { path: "/login", name: "login", component: () => import("pages/login/Login.vue") },
    {
        path: "/",
        component: () => import("layouts/Layout.vue"),
        children: [
            { path: "", name: "index", component: () => import("pages/index/Index.vue"), meta: { scope: [] } },
            // projects
            { path: "/projects/:id", name: "project:edit", component: () => import("pages/projects/Project.vue"), meta: { scope: [] } },
            { path: "/projects/registration", name: "project:registration", component: () => import("pages/projects/registration/ProjectRegistration.vue"), meta: { scope: [ RoleEnum.ADMIN ] } },
            // users
            { path: "/users", name: "users", component: () => import("pages/users/Users.vue"), meta: { scope: [] } },
            { path: "/users/:id", name: "user:edit", component: () => import("pages/users/registration/UserRegistration.vue"), meta: { scope: [] } },
            { path: "registration", name: "user:registration", component: () => import("pages/users/registration/UserRegistration.vue"), meta: { scope: [ RoleEnum.ADMIN ] } }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    { path: "*", component: () => import("pages/errors/Error404.vue") }
];

export default routes;
