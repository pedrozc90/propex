/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, { AxiosInstance } from "axios";
import { boot } from "quasar/wrappers";

/**
 * Insert a Authorizaton token into request headers.
 * @param data                              -- response data.
 * @param headers                           -- request headers.
 */
function addAuthorizationToken(data: any, headers: any): string {
    const token: string | null = localStorage.getItem("token");
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return JSON.stringify(data);
}

/**
 * Check if response data has a message property.
 * @param data                              -- resoponse data.
 */
function filterResponseMessage(data: any): any {
    if (data && data.message) {
        console.info("MESSAGE:", data);
    }
    return data;
}

console.log("ROOT_API", process.env.VUE_APP_ROOT_API);

/**
 * Create a new axios instance with default configuration.
 */
export const axiosInstance: AxiosInstance = Axios.create({
    baseURL: `${process.env.VUE_APP_ROOT_API || "http://127.0.0.1:9000"}/api`,
    headers: { "Content-Type": "application/json" },
    params: {},
    data: {},
    responseType: "json",
    transformRequest: [
        (data: any, headers: any) => addAuthorizationToken(data, headers)
    ],
    transformResponse: [
        (data: any) => filterResponseMessage(data)
    ]
});

declare module "vue/types/vue" {
    interface Vue {
        $axios: AxiosInstance;
    }
}

export default boot(({ Vue }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Vue.prototype.$axios = axiosInstance;
});
