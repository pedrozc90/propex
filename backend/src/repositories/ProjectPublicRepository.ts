import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectPublic } from "../entities";

@EntityRepository(ProjectPublic)
export class ProjectPublicRepository extends GenericRepository<ProjectPublic> {
    
    public async init(): Promise<any> {
        return null;
    }

}
