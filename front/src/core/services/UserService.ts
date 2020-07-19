import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { User, IOptions, RoleEnum } from "../types";
import { Page } from "../models";
import { StringUtils } from "../utils";

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
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return await axiosInstance.get<User>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async fetchCollaborators(options: UserOptions): Promise<Page<User>> {
        if (!options.page) options.page = 1;
        if (!options.rpp) options.rpp = 15;
        options.role = RoleEnum.COLLABORATOR;
        return this.fetch(options);
    }

    public async save(user: User): Promise<unknown> {
        return axiosInstance.post(this.url, { user });
    }
    
}

export const userService = UserService.create();
