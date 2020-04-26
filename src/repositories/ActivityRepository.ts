import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Activity } from "../entities";

@EntityRepository(Activity)
export class ActivityRepository extends GenericRepository<Activity> {

}
