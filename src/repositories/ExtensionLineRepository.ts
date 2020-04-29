import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine, Page } from "../entities";
import { Like } from "typeorm";
import { IOptions } from "../types";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {

    public async fetch(options: IOptions): Promise<Page<ExtensionLine>> {
        const params: any = {};
        if (options.page && options.rpp) {
            params.skip = (options.page - 1) * options.rpp;
            params.take = options.rpp;
        }
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { operation: Like(`%${options.q}%`) }
            ];
        };
        return Page.of(await this.find(params), options.page, options.rpp);
    }

    public async list(options: any): Promise<ExtensionLine[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { operation: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }

}
