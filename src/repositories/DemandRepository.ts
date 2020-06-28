import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Demand, Project } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

interface DemandOptions extends IOptions {
    id?: number;
    description?: string;
    justification?: string;
    project?: Project;
    projectId?: number;
}

@EntityRepository(Demand)
export class DemandRepository extends GenericRepository<Demand> {

    /**
     * Return a list of demands.
     * @param params                        -- filter parameters.
     */
    public async fetch(params: DemandOptions): Promise<Demand[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("d");

        if (params.project || params.projectId) {
            const projectId = params.projectId || params.project?.id;
            query.innerJoin("d.project", "p", "p.id = :projectId", { projectId });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("d.description LIKE :description", { description: `%${params.q}%` })
                .orWhere("d.justification LIKE :justification", { justification: `%${params.q}%` });
        }

        if ((page && page > 0) && (rpp && rpp > 0)) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return await query.getMany();
    }

    /**
     * Find if demand belongs to a project.
     * @param id                            -- demand id.
     * @param projectId                     -- project id.
     */
    public async findByProject(id: number, projectId: number): Promise<Demand | undefined> {
        return this.findOne({
            where: {
                id,
                project: { id: projectId }
            },
            join: {
                alias: "d",
                innerJoin: { project: "d.project" }
            }
        });
    }

}
