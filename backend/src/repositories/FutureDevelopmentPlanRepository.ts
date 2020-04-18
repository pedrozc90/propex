import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { FutureDevelopmentPlan, Project } from "../entities";

@EntityRepository(FutureDevelopmentPlan)
export class FutureDevelopmentPlanRepository extends GenericRepository<FutureDevelopmentPlan> {
    
    public async init(project: Project): Promise<any> {
        const fdp = new FutureDevelopmentPlan();
        fdp.activities = "bla bla bla ...";
        fdp.expectedResults = "bla bla bla ...";
        fdp.participantsNumberForecast = "bla bla bla ...";
        fdp.project = project;

        return this.save(fdp);
    }

}
