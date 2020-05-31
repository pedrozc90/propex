import { EntityRepository } from "@tsed/typeorm";
import { Unauthorized } from "@tsed/exceptions";

import { GenericRepository } from "./generics/GenericRepository";
import { Project, ProjectTarget } from "../entities";
import { AgeRange, IContext, Scope } from "../types";
import { AgeRangeEnumTransformer } from "../utils";
import { ProjectTargetRepository } from "./ProjectTargetRepository";

const relations = [
    "disclosureMedias",
    "eventPresentations",
    "evaluations",
    "futureDevelopmentPlans",
    "partners",
    "demands",
    "publications",
    "projectHumanResources",
    "projectPublics",
    "projectTargets",
    "projectThemeAreas",
    "activities",
    "extensionLines",
    "knowledgeAreas",
    "attachments"
];

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {

    constructor(private projectTargetRepository: ProjectTargetRepository) {
        super(relations);
    }
    
    /**
     * Return a project if user is linked to it.
     * @param context               -- user context.
     * @param id                    -- project id.
     */
    public async findByContext(id: number, context: IContext, coodinator: boolean = false): Promise<Project> {
        let query = this.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr")
            .where("p.id = :id", { id });

        if (!context.scope || !context.scope.isAdmin) {
            query = query.innerJoin("phr.user", "usr", "user.id = :userId", { userId: context.user?.id });
        }

        if (coodinator) {
            query = query.where("phr.coordinator = :coordinator", { coodinator: true });
        }

        const project = await query.getOne();
        if (!project) {
            if (coodinator) {
                throw new Unauthorized("Coordinator only is allowed here.");
            }
            throw new Unauthorized("You are not part of this project.");
        }

        return project;
    }

}
