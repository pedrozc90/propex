import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { FutureDevelopmentPlan, Page } from "../entities";

import { StringUtils } from "../core/utils";

@EntityRepository(FutureDevelopmentPlan)
export class FutureDevelopmentPlanRepository extends GenericRepository<FutureDevelopmentPlan> {

    public async fetch(page: number = 1, rpp: number = 15, q?: string, projectId?: number): Promise<Page<FutureDevelopmentPlan>> {
        const query = this.createQueryBuilder("fdp");

        if (StringUtils.isNotEmpty(q)) {
            query.where("fdp.activities LIKE :activities", { activities: `%${q}%` })
                .orWhere("fdp.expected_results LIKE :expectedResults", { expectedResults: `%${q}%` });
        }

        if (projectId) {
            query.innerJoin("fdp.project", "p", "p.id = :projectId", { projectId });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<FutureDevelopmentPlan>(await query.getMany(), page, rpp);
    }
    
}
