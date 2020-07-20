import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { ExtensionLine, IOptions } from "../types";
import { Page } from "../models";
import { StringUtils } from "../utils";

export interface ExtensionLineOptions extends IOptions {
    id?: number;
    name?: string;
}

export class ExtensionLineService extends BasicService<ExtensionLine> {

    private static instance: ExtensionLineService;

    constructor() {
        super("/extension-lines");
    }

    public static create(): ExtensionLineService {
        if (!ExtensionLineService.instance) {
            ExtensionLineService.instance = new ExtensionLineService();
        }
        return ExtensionLineService.instance;
    }

    public async fetch(params: ExtensionLineOptions): Promise<Page<ExtensionLine>> {
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return await axiosInstance.get<ExtensionLine>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async save(extensionLine: ExtensionLine): Promise<unknown> {
        return axiosInstance.post(this.url, { extensionLine });
    }
    
}

export const extensionLineService = ExtensionLineService.create();
