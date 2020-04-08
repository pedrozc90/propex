import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./GenericRepository";
import { Project } from "../entities";

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {
    
}
