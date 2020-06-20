import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { KnowledgeArea, ResultContent } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/:projectId/knowledge-areas")
@MergeParams(true)
export class ProjectKnowledgeAreaCtrl {

    constructor(
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    /**
     * Return all knowledge areas from a given project.
     * @param id                            -- project id.
     */
    @Get("")
    @CustomAuth({})
    public async getKnowledgeAreas(@PathParams("projectId") projectId: number): Promise<KnowledgeArea[]> {
        return this.KnowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param id                            -- project id.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    @Post("")
    @CustomAuth({})
    public async postKnowledgeAreas(@Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<ResultContent<KnowledgeArea[]>> {
        // select project with user is part of.
        const project = await this.ProjectRepository.findByContext(projectId, context);

        // save project knowledge areas relationship.
        const savedKnowledgeAreas = await this.KnowledgeAreaRepository.overwrite(project, knowledgeAreas);

        return ResultContent.of<KnowledgeArea[]>(savedKnowledgeAreas).withMessage("Project knowledge areas successfully saved!");
    }

}
