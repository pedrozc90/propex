import { axiosInstance } from "../../boot/axios";

import BasicService from "./BasicService";
import { User } from "../types";

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

    public async save(user: User): Promise<unknown> {
        return axiosInstance.post(this.url, { user });
    }

}

export const userService = UserService.create();
