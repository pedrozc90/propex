import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Evaluation, Page } from "../entities";

import { StringUtils } from "../core/utils";

@EntityRepository(Evaluation)
export class EvaluationRepository extends GenericRepository<Evaluation> {

    public async fetch(page: number = 1, rpp: number = 15, q?: string, projectId?: number): Promise<Page<Evaluation>> {
        const query = this.createQueryBuilder("ev")
            .innerJoin("ev.project", "project");

        if (StringUtils.isNotEmpty(q)) {
            query.where("ev.description LIKE :description", { description: `%${q}%` });
        }

        if (projectId) {
            query.where("project.id = :projectId", { projectId });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Evaluation>(await query.getMany(), page, rpp);
    }

}
