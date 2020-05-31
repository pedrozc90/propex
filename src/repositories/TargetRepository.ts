import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Target } from "../entities";

@EntityRepository(Target)
export class TargetRepository extends GenericRepository<Target> {

}
