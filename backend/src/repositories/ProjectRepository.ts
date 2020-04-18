import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Project } from "../entities";

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {
    
    public async init(): Promise<any> {
        const p = new Project();
        p.name = "Project A";
        p.institutionalLinkName = "Project A Link";
        p.startSeason = "T1";
        p.involvedClasses = "debug";
        p.pccCalendarClassesArticulation = "debug";
        p.previewCreditsClasses = "debug";
        p.infrastructure = "debug";
        p.publicParticipation = "debug";
        p.accompanimentAndEvaluation = "debug";

        return this.save(p);
    }

}
