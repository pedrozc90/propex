import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";
import { Like } from "typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ThemeArea, Page } from "../entities";
import { IOptions } from "../core/types";

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

    public async findManyByProject(projectId: number, main?: boolean): Promise<ThemeArea[]> {
        const query = this.createQueryBuilder("ta")
            .innerJoin("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId });
        
        if (isBoolean(main)) {
            query.where("pta.main = :main", { main: (main) ? 1 : 0 });
        }

        return query.getMany();
    }

    public async findByProject(id: number, projectId: number): Promise<ThemeArea | undefined> {
        return this.createQueryBuilder("ta")
            .innerJoin("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId })
            .where("ta.id = :id", { id })
            .getOne();
    }
    
}
