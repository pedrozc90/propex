import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { ExtensionLine } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/:projectId/extension-lines")
@MergeParams(true)
export class ProjectExtensionLineCtrl {

    constructor(
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    /**
     * Returns all extension lines from a given project.
     * @param projectId                     -- project id.
     */
    @Get("")
    @CustomAuth({})
    public async getExtensionLines(@Required() @PathParams("projectId") projectId: number): Promise<ExtensionLine[]> {
        return this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

    /**
     * Create/Update/Delete project extension lines, delete the items not send, and add the new items.
     * @param projectId                     -- project id.
     * @param extensionLines                -- list of extension lines (they must exists in the database).
     */
    @Post("")
    @CustomAuth({})
    public async postExtensionLines(@Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        // load extension lines which the project has connection.
        const projectExtensionLines = await this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId })
            .getMany();
        
        // extension lines not send in the request should be removed
        const projectExtensionLinesToDelete = projectExtensionLines.filter((a) => extensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensionLinesToDelete && projectExtensionLinesToDelete.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("extensionLines").of(project).remove(projectExtensionLinesToDelete);
        }

        const projectExtensitonLinesToInsert = extensionLines.filter((a) => !!a.id && projectExtensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensitonLinesToInsert && projectExtensitonLinesToInsert.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("extensionLines").of(project).add(projectExtensitonLinesToInsert);
        }

        return { message: "Project extension lines updated!" };
    }

}
