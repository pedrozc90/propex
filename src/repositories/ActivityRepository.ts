import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Activity, Project } from "../entities";
import { IOptions } from "../core/types";
import { StringUtils } from "../core/utils";
import { isBoolean } from "@tsed/core";

interface ActivityOptions extends IOptions {
    id?: number;
    project?: Project;
    projectId?: number;
    name?: string;
    description?: string;
    external?: boolean;
    numberOfMembers?: number;
    date?: string;
    period?: number;
    executionWeekday?: string;
    executionHour?: string;
    results?: string;
}

@EntityRepository(Activity)
export class ActivityRepository extends GenericRepository<Activity> {

    /**
     * Return a list of activities.
     * @param options                       -- options
     */
    public async fetch(params: ActivityOptions): Promise<Activity[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("a");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("a.project", "p", "p.id = :projectId", { projectId });
        }
        
        if (StringUtils.isNotEmpty(params.q)) {
            query.where("a.name LIKE :name", { name: `%${params.q}%` })
                .orWhere("a.description LIKE :description", { description: `%${params.q}%` });
        }

        if (isBoolean(params.external)) {
            query.where("a.external = :external", { external: params.external });
        }
        
        query.orderBy("a.date", "ASC");

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }
        
        return await query.getMany();
    }

}
