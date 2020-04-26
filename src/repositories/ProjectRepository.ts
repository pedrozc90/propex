import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Project } from "../entities";

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

    constructor() {
        super(relations);
    }

}
