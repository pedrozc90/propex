import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea, Page } from "../entities";
import { IOptions } from "../types";

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {
    
    public async fetch(options: IOptions): Promise<Page<KnowledgeArea>> {
        const params: any = {};
        if (options.page && options.rpp) {
            params.skip = (options.page - 1) * options.rpp;
            params.take = options.rpp;
        }
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return Page.of(await this.find(params), options.page, options.rpp);
    }

    public async list(options: any): Promise<KnowledgeArea[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }
    
}
