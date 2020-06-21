import { isBoolean } from "@tsed/core";
import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, $log, MergeParams, UseBeforeEach } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, PublicRepository } from "../../repositories";
import { Public, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/publics")
@MergeParams(true)
export class ProjectPublicCtrl {

    constructor(
        private projectRepository: ProjectRepository,
        private publicRepository: PublicRepository) {
        // initialize stuff here
    }

    /**
     * Return all publics from a given project.
     * @param id                            -- project id.
     * @param directly                      -- filter direct publics.
     */
    @Get("")
    @Authenticated({})
    public async getPublics(
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("directly") directly?: boolean
    ): Promise<Public[]> {
        const query = this.publicRepository.createQueryBuilder("pb")
            .innerJoinAndSelect("pb.projectPublics", "ppb", "ppb.project_id = :projectId", { projectId });
        
        if (isBoolean(directly)) {
            query.where("ppb.directly = :directly", { directly: (directly) ? 1 : 0 });
        }

        return query.getMany();
    }

    /**
     * Overwrite project publics.
     * @param context                       -- user context.
     * @param id                            -- project id.
     * @param publics                       -- project publics data.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async setPublics(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("publics") publics: Public[]
    ): Promise<ResultContent<Public[]>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        $log.debug(project, publics);
        // update project publics.
        // const savedPublics = await this.PublicRepository.overwrite(project, publics);

        // return ResultContent.of<Public[]>(savedPublics).withMessage("Project publics successfully saved!");
        throw new NotImplemented("Method Not Implemented!");
    }

}
