import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectHumanResource } from "../entities";

@EntityRepository(ProjectHumanResource)
export class ProjectHumanResourceRepository extends GenericRepository<ProjectHumanResource> {

}
