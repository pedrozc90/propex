import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ExtensionLineRepository, ProjectRepository } from "../../repositories";
import { ExtensionLine } from "../../entities";
import { IContext } from "../../core/types";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/extension-lines")
@MergeParams(true)
export class ProjectExtensionLineCtrl {

    constructor(private extensionLineRepository: ExtensionLineRepository, private projectRepository: ProjectRepository) {}

    /**
     * Returns all extension lines from a given project.
     * @param projectId                     -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getExtensionLines(@Required() @PathParams("projectId") projectId: number): Promise<ExtensionLine[]> {
        return this.extensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Create/Update/Delete project extension lines, delete the items not send, and add the new items.
     * @param projectId                     -- project id.
     * @param extensionLines                -- list of extension lines (they must exists in the database).
     */
    @Post("")
    @Authenticated({})
    public async postExtensionLines(@Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        // load extension lines which the project has connection.
        const projectExtensionLines = await this.extensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
        
        // extension lines not send in the request should be removed
        const projectExtensionLinesToDelete = projectExtensionLines.filter((a) => extensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensionLinesToDelete && projectExtensionLinesToDelete.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("extensionLines").of(project).remove(projectExtensionLinesToDelete);
        }

        const projectExtensitonLinesToInsert = extensionLines.filter((a) => !!a.id && projectExtensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensitonLinesToInsert && projectExtensitonLinesToInsert.length > 0) {
            await this.projectRepository.createQueryBuilder("project").relation("extensionLines").of(project).add(projectExtensitonLinesToInsert);
        }

        return { message: "Project extension lines updated!" };
    }

}
