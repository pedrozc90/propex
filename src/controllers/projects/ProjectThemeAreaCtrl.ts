import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { ProjectThemeArea, ThemeArea, ResultContent } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/:projectId/theme-areas")
@MergeParams(true)
export class ProjectThemeAreaCtrl {

    constructor(
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository) {
        // initialize stuff here
    }

    /**
     * Return the list of theme areas connected to a given project.
     * @param id                            -- project id.
     */
    @Get("")
    @CustomAuth({})
    public async getThemeAreas(@PathParams("projectId") projectId: number): Promise<{ main: ThemeArea[], secondary: ThemeArea[] }> {
        const query = this.ThemeAreaRepository.createQueryBuilder("ta")
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
    @CustomAuth({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async setThemeAreas(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @BodyParams("main") main?: ThemeArea[],
        @BodyParams("secondary") secondary?: ThemeArea[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.ProjectRepository.findByContext(projectId, context);

        // create project theme aread
        const projectThemeAreas = await this.ProjectThemeAreaRepository.overwrite(project, main, secondary);

        return ResultContent.of<ProjectThemeArea[]>(projectThemeAreas).withMessage("Project Theme Areas successfully saved.");
    }

}
