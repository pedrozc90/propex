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
        component: () => import("layouts/Layout.vue"),
        children: [
            { path: "", name: "index", component: () => import("pages/index/Index.vue") },
            {
                path: "/users",
                component: () => import("layouts/EmptyLayout.vue"),
                children: [
                    { path: "/", name: "users", component: () => import("pages/users/Users.vue") },
                    { path: ":id", name: "user:edit", component: () => import("pages/users/registration/UserRegistration.vue") },
                    { path: "registration", name: "user:registration", component: () => import("pages/users/registration/UserRegistration.vue") }
                ]
            },
            {
                path: "/projects",
                component: () => import("layouts/EmptyLayout.vue"),
                children: [
                    { path: ":id", name: "project", component: () => import("pages/projects/Project.vue") },
                    { path: "registration", name: "project:registration", component: () => import("pages/projects/registration/ProjectRegistration.vue") }
                ]
            }
        ]
    },

    // Always leave this as last one,
    // but you can also remove it
    { path: "*", component: () => import("pages/errors/Error404.vue") }
];

export default routes;
