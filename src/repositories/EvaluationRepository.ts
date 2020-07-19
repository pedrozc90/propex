import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Evaluation } from "../entities";

import { StringUtils } from "../core/utils";
import { IOptions } from "../core/types";

interface EvaluationOptions extends IOptions {
    id?: number;
    description?: string;
    projectId?: number;
}

@EntityRepository(Evaluation)
export class EvaluationRepository extends GenericRepository<Evaluation> {

    /**
     * Return a list of evaluations.
     * @param params                        -- search params.
     */
    public async fetch(params: EvaluationOptions): Promise<Evaluation[]> {
        const page = params.page;
        const rpp = params.rpp;

        const query = this.createQueryBuilder("ev");

        if (params.projectId) {
            query.innerJoin("ev.project", "p", "p.id = :projectId", { projectId: params.projectId });
        }

        if (StringUtils.isNotEmpty(params.q)) {
            query.where("ev.description LIKE :description", { description: `%${params.q}%` });
        }

        if (StringUtils.isNotEmpty(params.description)) {
            query.where("ev.description = :description", { description: params.description });
        }

        if (page && rpp) {
            query.skip((page - 1) * rpp).take(rpp);
        }

        return await query.getMany();
    }

}
