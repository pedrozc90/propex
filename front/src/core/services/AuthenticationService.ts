import { AxiosResponse, AxiosError } from "axios";
import { axiosInstance } from "../../boot/axios";

import { IAuth, UserCredentials, User } from "../types";
import { debug } from "console";

const TOKEN = "token";

export class AuthenticationService {

    private static instance: AuthenticationService;

    constructor(private url: string) {}

    public static create(): AuthenticationService {
        if (!AuthenticationService.instance) {
            AuthenticationService.instance = new AuthenticationService("/auth");
        }
        return AuthenticationService.instance;
    }

    // ----------------------------------------------------------------------
    // LOCAL STORAGE:
    // ----------------------------------------------------------------------
    public setToken(token: string): void {
        localStorage.setItem(TOKEN, token);
    }

    public getToken(): string | null {
        const token: string | null = localStorage.getItem(TOKEN);
        return token;
    }

    public isAuthenticated(): boolean {
        const token: string | null = this.getToken();
        return ((token !== undefined) && (token != null) && (token !== "undefined") && (token !== "null"));
    }

    // ----------------------------------------------------------------------
    // API:
    // ----------------------------------------------------------------------
    public async login(credentials: UserCredentials, rememberMe?: boolean): Promise<IAuth | null> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const auth = await axiosInstance.post<IAuth>(`${this.url}/login`, { credentials, rememberMe })
            .then((response: AxiosResponse) => (response) ? response.data.content : null)
            .catch((error: AxiosError) => {
                throw new Error(error.message);
            });
        return auth;
    }

    public async logout(): Promise<void> {
        localStorage.clear();
        await axiosInstance.post(`${this.url}/logout`);
    }

    public async context(): Promise<User> {
        return axiosInstance.get<User>(`${this.url}/context`)
            .then((response: AxiosResponse) => response.data.content)
            .catch((error: AxiosError) => {
                throw new Error(error.message);
            });
    }

}

export const authenticationService = AuthenticationService.create();
