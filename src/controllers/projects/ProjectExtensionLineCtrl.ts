import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach, Delete, Put } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ExtensionLineRepository, ProjectRepository } from "../../repositories";
import { ExtensionLine, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { NotFound } from "@tsed/exceptions";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/extension-lines")
@MergeParams(true)
export class ProjectExtensionLineCtrl {

    constructor(
        private extensionLineRepository: ExtensionLineRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuff here
    }

    /**
     * Returns all extension lines from a given project.
     * @param projectId                     -- project id.
     */
    @Get("")
    @Authenticated({})
    public async get(@Required() @PathParams("projectId") projectId: number): Promise<ExtensionLine[]> {
        return this.extensionLineRepository.findManyByProject(projectId);
    }

    /**
     * Create/Update/Delete project extension lines, delete the items not send, and add the new items.
     * @param projectId                     -- project id.
     * @param extensionLines                -- list of extension lines (they must exists in the database).
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<ResultContent<ExtensionLine[]>> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        for (const el of extensionLines) {
            const els = await this.extensionLineRepository.findById(el.id);
            if (!els) {
                throw new NotFound(`KnowledgeArea ${el.name || el.id} not found.`);
            }

            const pel = await this.extensionLineRepository.findByProject(el.id, projectId);
            if (!pel) {
                await this.extensionLineRepository.createQueryBuilder("el").relation("projects").of(el).add(project);
            }
        }

        const saved = await this.extensionLineRepository.findManyByProject(projectId);

        return ResultContent.of<ExtensionLine[]>(saved)
            .withMessage("ProjectExtensionLines sucessfully saved!");
    }

    /**
     * Create/Update/Delete project extension lines, delete the items not send, and add the new items.
     * @param projectId                     -- project id.
     * @param extensionLines                -- list of extension lines (they must exists in the database).
     */
    @Put("")
    @Authenticated({})
    public async overwrite(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<ResultContent<ExtensionLine[]>> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        // load extension lines which the project has connection.
        const projectExtensionLines = await this.extensionLineRepository.findManyByProject(projectId);
        
        // extension lines not send in the request should be removed
        const projectExtensionLinesToDelete = projectExtensionLines.filter((a) => extensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensionLinesToDelete && projectExtensionLinesToDelete.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("extensionLines").of(project).remove(projectExtensionLinesToDelete);
        }

        const projectExtensitonLinesToInsert = extensionLines.filter((a) => !!a.id && projectExtensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensitonLinesToInsert && projectExtensitonLinesToInsert.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("extensionLines").of(project).add(projectExtensitonLinesToInsert);
        }

        const els = await this.extensionLineRepository.findManyByProject(projectId);

        return ResultContent.of<ExtensionLine[]>(els).withMessage("ProjectExtensionLines successfully updated!");
    }

    /**
     * Delete the relationship between a project and the them area.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param knowledgeAreaId               -- knowledge area id.
     */
    @Delete("/:extensionLineId")
    @Authenticated({})
    public async delete(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @PathParams("extensionLineId") extensionLineId: number
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        const extensionLine = await this.extensionLineRepository.findByProject(extensionLineId, projectId);
        if (!extensionLine) {
            throw new NotFound(`ExtensionLine ${extensionLineId} do not have a relationship with the current project.`);
        }
        
        await this.extensionLineRepository.createQueryBuilder("el").relation("projects").of(extensionLine).remove(project);

        return ResultContent.of().withMessage("ProjectExtensionLines successfully delete!");
    }

}
