import { axiosInstance } from "../../boot/axios";
import { AxiosResponse } from "axios";

import BasicService from "./BasicService";
import { KnowledgeArea, IOptions } from "../types";
import { Page } from "../models";
import { StringUtils } from "../utils";

export interface KnowledgeAreaOptions extends IOptions {
    id?: number;
    name?: string;
}

export class KnowledgeAreaService extends BasicService<KnowledgeArea> {

    private static instance: KnowledgeAreaService;

    constructor() {
        super("/knowledge-areas");
    }

    public static create(): KnowledgeAreaService {
        if (!KnowledgeAreaService.instance) {
            KnowledgeAreaService.instance = new KnowledgeAreaService();
        }
        return KnowledgeAreaService.instance;
    }

    public async fetch(params: KnowledgeAreaOptions): Promise<Page<KnowledgeArea>> {
        if (StringUtils.isEmpty(params.q)) {
            params.q = undefined;
        }
        return await axiosInstance.get<KnowledgeArea>(this.url, { params: params })
            .then((response: AxiosResponse) => response.data.content);
    }

    public async save(knowledgeArea: KnowledgeArea): Promise<unknown> {
        return axiosInstance.post(this.url, { knowledgeArea });
    }
    
}

export const knowledgeAreaService = KnowledgeAreaService.create();
