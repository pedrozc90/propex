import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ThemeArea, Page } from "../entities";
import { IOptions } from "../types";

@EntityRepository(ThemeArea)
export class ThemeAreaRepository extends GenericRepository<ThemeArea> {

    /**
     * Return a paginated list of theme areas.
     * @param options                       -- query options.
     */
    public async fetch(options: IOptions): Promise<Page<ThemeArea>> {
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
        return Page.of<ThemeArea>(await this.find(params), options.page, options.rpp);
    }

    /**
     * Returns a list of theme areas.
     * @param options                       -- query options.
     */
    public async list(options: any): Promise<ThemeArea[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }
    
}
