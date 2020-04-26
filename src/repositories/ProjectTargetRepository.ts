import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectTarget } from "../entities";

@EntityRepository(ProjectTarget)
export class ProjectTargetRepository extends GenericRepository<ProjectTarget> {

}
