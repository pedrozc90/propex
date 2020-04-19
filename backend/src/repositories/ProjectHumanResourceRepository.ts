import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectHumanResource } from "../entities";

@EntityRepository(ProjectHumanResource)
export class ProjectHumanResourceRepository extends GenericRepository<ProjectHumanResource> {
    
    public async init(): Promise<any> {
        return null;
    }

}
