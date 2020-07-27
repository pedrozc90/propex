import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { IOptions, AgeRange, Target } from "../types";

export interface TargetOptions extends IOptions {
    ageRange?: AgeRange;
    project?: number;
}

export class TargetService extends BasicService<Target> {

    private static instance: TargetService;

    constructor() {
        super("/targets");
    }

    public static create(): TargetService {
        if (!TargetService.instance) {
            TargetService.instance = new TargetService();
        }
        return TargetService.instance;
    }

    public async listEnum(): Promise<AgeRange[]> {
        return axiosInstance.get(`${this.url}/age-ranges`).then((res: AxiosResponse) => res.data.content);
    }

    // public async fetch(params: TargetOptions): Promise<Page<Target>> {
    //     if (StringUtils.isEmpty(params.q)) {
    //         params.q = undefined;
    //     }
    //     return await axiosInstance.get<Target>(this.url, { params: params })
    //         .then((response: AxiosResponse) => response.data.content);
    // }

    // public async save(target: Target): Promise<unknown> {
    //     return axiosInstance.post(this.url, { target });
    // }

    public sort() {
        return (a: Target, b: Target) => {
            return (a.ageRange?.order || 0) - (b.ageRange?.order || 0);
        };
    }

}

export const targetService = TargetService.create();
