import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { User, IOptions, RoleEnum } from "../types";
import { Page } from "../models";

export interface UserOptions extends IOptions {
    role?: RoleEnum;
}

export class UserService extends BasicService<User> {

    private static instance: UserService;

    constructor() {
        super("/users");
    }

    public static create(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async fetch(params: UserOptions): Promise<Page<User>> {
        return await axiosInstance.get<User>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async fetchCollaborators(): Promise<Page<User>> {
        return this.fetch({ page: 1, rpp: 15, role: RoleEnum.COLLABORATOR });
    }

    public async save(user: User): Promise<unknown> {
        return axiosInstance.post(this.url, { user });
    }
    
}

export const userService = UserService.create();
