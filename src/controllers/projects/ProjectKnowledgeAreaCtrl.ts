import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { KnowledgeAreaRepository, ProjectRepository } from "../../repositories";
import { KnowledgeArea, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/knowledge-areas")
@MergeParams(true)
export class ProjectKnowledgeAreaCtrl {

    constructor(private knowledgeAreaRepository: KnowledgeAreaRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return all knowledge areas from a given project.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getKnowledgeAreas(@PathParams("projectId") projectId: number): Promise<KnowledgeArea[]> {
        return this.knowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param id                            -- project id.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    @Post("")
    @Authenticated({})
    public async postKnowledgeAreas(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<ResultContent<KnowledgeArea[]>> {
        // select project with user is part of.
        const project = await this.projectRepository.findByContext(projectId, context);

        // save project knowledge areas relationship.
        const savedKnowledgeAreas = await this.knowledgeAreaRepository.overwrite(project, knowledgeAreas);

        return ResultContent.of<KnowledgeArea[]>(savedKnowledgeAreas).withMessage("Project knowledge areas successfully saved!");
    }

}
