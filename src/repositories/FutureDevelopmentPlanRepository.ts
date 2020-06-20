import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { FutureDevelopmentPlan, Page } from "../entities";
import { IOptions } from "../core/types";

import { StringUtils } from "../core/utils";

@EntityRepository(FutureDevelopmentPlan)
export class FutureDevelopmentPlanRepository extends GenericRepository<FutureDevelopmentPlan> {

    public async fetch(options: IOptions): Promise<Page<FutureDevelopmentPlan>> {
        const page = options.page || 1;
        const rpp = options.rpp || 15;
        const q = options.q;
        const project = options.project;

        const query = this.createQueryBuilder("fdp");

        if (StringUtils.isNotEmpty(q)) {
            query.where("ep.activities LIKE :activities", { activities: `%${q}%` })
                .orWhere("ep.expected_results LIKE :expectedResults", { expectedResults: `%${q}%` });
        }

        if (project) {
            if (typeof project === "string") {
                query.innerJoin("fdp.project", "p", "p.title LIKE :project", { project: `%${project}%` });
            } else {
                query.innerJoin("fdp.project", "p", "p.id = :project", { project });
            }
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<FutureDevelopmentPlan>(await query.getMany(), page, rpp);
    }
    
}
