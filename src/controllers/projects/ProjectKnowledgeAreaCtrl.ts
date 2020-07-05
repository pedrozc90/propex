import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach, Put, Delete } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { KnowledgeAreaRepository, ProjectRepository } from "../../repositories";
import { KnowledgeArea, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { NotFound } from "@tsed/exceptions";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/knowledge-areas")
@MergeParams(true)
export class ProjectKnowledgeAreaCtrl {

    constructor(
        private knowledgeAreaRepository: KnowledgeAreaRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
    }

    /**
     * Return all knowledge areas from a given project.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async get(@PathParams("projectId") projectId: number): Promise<KnowledgeArea[]> {
        return this.knowledgeAreaRepository.fetch({ projectId });
    }

    /**
     * Save project theme areas.
     * @param id                            -- project id.
     * @param main                          -- list of main theme areas.
     * @param secondary                     -- list of secondary theme areas.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<ResultContent<KnowledgeArea[]>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        for (const ka of knowledgeAreas) {
            const savedKnowledgeArea = await this.knowledgeAreaRepository.findOne({ id: ka.id });
            if (!savedKnowledgeArea) {
                throw new NotFound(`KnowledgeArea ${ka.name || ka.id} not found.`);
            }

            const pka = await this.knowledgeAreaRepository.findByProject(ka.id, projectId);

            if (!pka) {
                await this.knowledgeAreaRepository.createQueryBuilder("ka").relation("projects").of(ka).add(project);
            }
        }

        const saved = await this.knowledgeAreaRepository.fetch({ projectId });

        return ResultContent.of<KnowledgeArea[]>(saved)
            .withMessage("ProjectKnowledgeAreas sucessfully saved!");
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param id                            -- project id.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    @Put("")
    @Authenticated({})
    public async overwrite(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<ResultContent<KnowledgeArea[]>> {
        // select project with user is part of.
        const project = await this.projectRepository.findByContext(projectId, context);

        // save project knowledge areas relationship.
        const savedKnowledgeAreas = await this.knowledgeAreaRepository.overwrite(project, knowledgeAreas);

        return ResultContent.of<KnowledgeArea[]>(savedKnowledgeAreas).withMessage("ProjectKnowledgeAreas successfully updated!");
    }

    /**
     * Delete the relationship between a project and knowledge area.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param knowledgeAreaId               -- knowledge area id.
     */
    @Delete("/:knowledgeAreaId")
    @Authenticated({})
    public async delete(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @PathParams("knowledgeAreaId") knowledgeAreaId: number
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        const knowledgeArea = await this.knowledgeAreaRepository.findByProject(knowledgeAreaId, projectId);
        if (!knowledgeArea) {
            throw new NotFound(`KnowledgeArea ${knowledgeAreaId} do not have a relationship with the current project.`);
        }
        
        await this.knowledgeAreaRepository.createQueryBuilder("ka").relation("projects").of(knowledgeArea).remove(project);

        return ResultContent.of().withMessage("ProjectKnowledgeArea successfully delete!");
    }

}
