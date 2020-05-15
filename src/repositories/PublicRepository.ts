import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Public, Page } from "../entities";
import { IOptions } from "../types";
import { Like } from "typeorm";

@EntityRepository(Public)
export class PublicRepository extends GenericRepository<Public> {

    public async fetch(options: IOptions): Promise<Page<Public>> {
        const params: any = {};
        if (options.page && options.rpp) {
            params.skip = (options.page - 1) * options.rpp;
            params.take = options.rpp;
        }
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { cras: Like(`%${options.q}%`) }
            ];
        };
        return Page.of(await this.find(params), options.page, options.rpp);
    }

    public async list(options: any): Promise<Public[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { cras: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }
    
}
