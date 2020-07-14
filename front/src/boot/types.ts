/* eslint-disable @typescript-eslint/no-explicit-any */
// reference: https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins

// make sure to import "vue" before declaring augmented types
import Vue from "vue";
import { Store } from "vuex";
import VueRouter, { Route } from "vue-router";

import { AxiosInstance } from "axios";
import { QVueGlobals } from "quasar";

// specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module "vue/types/vue" {
    // declare augmentation for Vue
    interface Vue {
        $store: Store<any>;
        $axios: AxiosInstance;
        $router: VueRouter;
        $route: Route;
        $validator: any;
        $authentication: any;
        $q: QVueGlobals,
        dialog: any;
        sockets: any;
        // $filters: any;
    }

    // global properties can be declared
    // on the `VueConstructor` interface
    // interface VueConstructor {
    //     $myGlobal: string
    // }
}

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        sockets?: any;
        // filters?: { [key: string]: Function };
    }
}

// enables $router on store modules
declare module "vuex/types/index" {
    interface Store<S> {
        $router: VueRouter;
    }
}

// define properties not handled in standard lib.d.ts
// interface Window {
//     DeviceOrientationEvent: typeof DeviceOrientationEvent;
//     DeviceMotionEvent: typeof DeviceMotionEvent;
//     MutationObserver: typeof MutationObserver;
// }

// interface Navigator {
//     app: {
//         exitApp: () => any; // Or whatever is the type of the exitApp function
//     };
// }
