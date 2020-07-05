import { isBoolean } from "@tsed/core";
import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ThemeArea, Project } from "../entities";
import { IOptions } from "../core/types";
import { StringUtils } from "../core/utils";

interface ThemeAreaOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    name?: string;
    main?: boolean;
}

@EntityRepository(ThemeArea)
export class ThemeAreaRepository extends GenericRepository<ThemeArea> {

    /**
     * Return a paginated list of theme areas.
     * @param options                       -- query options.
     */
    public async fetch(params: ThemeAreaOptions): Promise<ThemeArea[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("ta")
            .leftJoin("ta.projectThemeAreas", "pta");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.where("pta.project_id = :projectId", { projectId });
        }

        if (isBoolean(params.main)) {
            query.andWhere("pta.main = :main", { main: (params.main) ? 1 : 0 });
        }
        
        if (StringUtils.isNotEmpty(params.name)) {
            query.andWhere("ta.name = :name", { name: params.name });
        };

        if (StringUtils.isNotEmpty(params.q)) {
            query.andWhere("ta.name LIKE :name", { name: `%${params.q}%` });
        };

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
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
