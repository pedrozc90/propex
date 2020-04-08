import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./GenericRepository";
import { Activity } from "../entities";

@EntityRepository(Activity)
export class ActivityRepository extends GenericRepository<Activity> {
    
}
