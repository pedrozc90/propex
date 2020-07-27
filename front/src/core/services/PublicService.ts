import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { IOptions, Public } from "../types";
import { Page } from "../models";
import { StringUtils } from "../utils";

export interface PublicOptions extends IOptions {
    name?: string;
    customizable?: boolean;
    cras?: string;
    project?: number;
}

export class PublicService extends BasicService<Public> {

    private static instance: PublicService;

    constructor() {
        super("/publics");
    }

    public static create(): PublicService {
        if (!PublicService.instance) {
            PublicService.instance = new PublicService();
        }
        return PublicService.instance;
    }

    public async fetch(params: PublicOptions): Promise<Page<Public>> {
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return await axiosInstance.get<Public>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

}

export const publicService = PublicService.create();
