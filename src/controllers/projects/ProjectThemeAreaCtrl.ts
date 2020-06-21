import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, ProjectThemeAreaRepository, ThemeAreaRepository } from "../../repositories";
import { ProjectThemeArea, ThemeArea, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/theme-areas")
@MergeParams(true)
export class ProjectThemeAreaCtrl {

    constructor(
        private projectRepository: ProjectRepository,
        private projectThemeAreaRepository: ProjectThemeAreaRepository,
        private themeAreaRepository: ThemeAreaRepository) {
        // initialize stuff here
    }

    /**
     * Return the list of theme areas connected to a given project.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getThemeAreas(@PathParams("projectId") projectId: number): Promise<{ main: ThemeArea[], secondary: ThemeArea[] }> {
        const query = this.themeAreaRepository.createQueryBuilder("ta")
            .innerJoin("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId });
        
        // load project's main theme areas
        const main = await query.where("pta.main = 1").getMany();

        // load project's secondary theme areas
        const secondary = await query.where("pta.main = 0").getMany();

        return { main, secondary };
    }

    /**
     * Save project theme areas.
     * @param id                            -- project id.
     * @param main                          -- list of main theme areas.
     * @param secondary                     -- list of secondary theme areas.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async setThemeAreas(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @BodyParams("main") main?: ThemeArea[],
        @BodyParams("secondary") secondary?: ThemeArea[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        // create project theme aread
        const projectThemeAreas = await this.projectThemeAreaRepository.overwrite(project, main, secondary);

        return ResultContent.of<ProjectThemeArea[]>(projectThemeAreas).withMessage("Project Theme Areas successfully saved.");
    }

}
