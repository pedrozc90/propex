import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectThemeArea } from "../entities";

@EntityRepository(ProjectThemeArea)
export class ProjectThemeAreaRepository extends GenericRepository<ProjectThemeArea> {
    
    public async init(): Promise<any> {
        return null;
    }

}
