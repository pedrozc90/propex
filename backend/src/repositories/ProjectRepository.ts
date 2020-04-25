import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Project } from "../entities";

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {
    
    public async init(): Promise<any> {
        const p = new Project();
        p.title = "Pilot";
        p.program = "Debugging";
        p.startSeason = "2016/01";
        p.includedCourses = "Ciências da Computação";
        p.pccAndCourseCalendar = "???";
        p.requiredCreditsClasses = "Banco de Dados I e II";
        // p.infrastructure = "debug";
        // p.publicParticipation = "debug";
        p.accompanimentAndEvaluation = "sim";

        return this.save(p);
    }

}
