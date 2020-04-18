import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Evaluation, Project } from "../entities";

@EntityRepository(Evaluation)
export class EvaluationRepository extends GenericRepository<Evaluation> {
    
    public async init(project: Project): Promise<any> {
        const e1 = new Evaluation();
        e1.description = "Evaluation A";
        e1.project = project;

        const e2 = new Evaluation();
        e2.description = "Evaluation B";
        e2.project = project;

        const e3 = new Evaluation();
        e3.description = "Evaluation C";
        e3.project = project;

        const e4 = new Evaluation();
        e4.description = "Evaluation D";
        e4.project = project;

        return this.save([ e1, e2, e3, e4 ]);
    }

}
