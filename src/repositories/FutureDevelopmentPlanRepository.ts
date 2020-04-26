import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { FutureDevelopmentPlan } from "../entities";

@EntityRepository(FutureDevelopmentPlan)
export class FutureDevelopmentPlanRepository extends GenericRepository<FutureDevelopmentPlan> {

}
