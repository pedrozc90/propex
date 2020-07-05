import { EntityRepository } from "@tsed/typeorm";
import { NotFound } from "@tsed/exceptions";

import { GenericRepository } from "./generics/GenericRepository";
import { Project } from "../entities";
import { Context } from "../core/models";

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
    "targets",
    "projectThemeAreas",
    "activities",
    "extensionLines",
    "knowledgeAreas",
    "attachments"
];

@EntityRepository(Project)
export class ProjectRepository extends GenericRepository<Project> {

    constructor() {
        super(relations);
    }
    
    /**
     * Return a project if user is linked to it.
     * @param context               -- user context.
     * @param id                    -- project id.
     */
    public async findByContext(id: number, context: Context, coodinator: boolean = false): Promise<Project> {
        const query = this.createQueryBuilder("p")
            .leftJoin("p.projectHumanResources", "phr")
            .where("p.id = :id", { id });

        if (!context.scope || !context.scope.isAdmin) {
            query.innerJoin("phr.user", "usr", "user.id = :userId", { userId: context.user?.id });
        }

        if (coodinator) {
            query.andWhere("phr.coordinator = :coordinator", { coodinator: true });
        }

        const project = await query.getOne();
        if (!project) {
            throw new NotFound("Project not found."); // 404
        }

        return project;
    }

}
