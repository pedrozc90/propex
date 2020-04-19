import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ProjectTarget, Project } from "../entities";
import { AgeRangeEnum } from "../types";

@EntityRepository(ProjectTarget)
export class ProjectTargetRepository extends GenericRepository<ProjectTarget> {
    
    public async init(project: Project): Promise<any> {
        const pt1 = new ProjectTarget();
        pt1.project = project;
        pt1.menNumber = 10;
        pt1.womenNumber = 10;
        pt1.ageRange = AgeRangeEnum.UNTIL_18;

        const pt2 = new ProjectTarget();
        pt2.project = project;
        pt2.menNumber = 5;
        pt2.womenNumber = 10;
        pt2.ageRange = AgeRangeEnum.FROM_19_TO_25;

        return this.save([ pt1, pt2 ]);
    }

}
