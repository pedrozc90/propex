import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach, Put, Delete } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

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
    public async get(@PathParams("projectId") projectId: number): Promise<{ main: ThemeArea[], secondary: ThemeArea[] }> {
        // load project's main theme areas
        const main = await this.themeAreaRepository.findManyByProject(projectId, true);

        // load project's secondary theme areas
        const secondary = await this.themeAreaRepository.findManyByProject(projectId, false);

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
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectThemeAreas") projectThemeAreas: ProjectThemeArea[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        // create project theme aread
        let toInsert: ProjectThemeArea[] = [];
        
        for (const pta of projectThemeAreas) {
            // keep theme area id
            const themeAreaId: number = (pta.themeArea) ? pta.themeArea.id : pta.themeAreaId;

            const ta = await this.themeAreaRepository.findById(themeAreaId);
            if (!ta) {
                throw new NotFound(`ThemeArea ${pta.themeArea.name || themeAreaId} not found.`);
            }

            let tmp = await this.projectThemeAreaRepository.findByProject(themeAreaId, projectId);
            if (!tmp) {
                tmp = this.projectThemeAreaRepository.create(ta);
                tmp.project = project;
            } else {
                tmp = this.projectThemeAreaRepository.merge(tmp, ta);
            }
            tmp.themeArea = ta;

            toInsert.push(tmp);
        }

        toInsert = await this.projectThemeAreaRepository.save(toInsert);

        return ResultContent.of<ProjectThemeArea[]>(toInsert)
            .withMessage("ProjectThemeAreas sucessfully saved!");
    }

    /**
     * Overwrite all realtionship between project and theme areas.
     * @param id                            -- project id.
     * @param main                          -- list of main theme areas.
     * @param secondary                     -- list of secondary theme areas.
     */
    @Put("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async overwrite(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @BodyParams("main") main?: ThemeArea[],
        @BodyParams("secondary") secondary?: ThemeArea[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        // create project theme aread
        const projectThemeAreas = await this.projectThemeAreaRepository.overwrite(project, main, secondary);

        return ResultContent.of<ProjectThemeArea[]>(projectThemeAreas).withMessage("ProjectThemeAreas successfully updated.");
    }

    /**
     * Delete the relationship between a project and the theme area.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param themeAreaId                   -- theme area id.
     */
    @Delete("/:themeAreaId")
    @Authenticated({})
    public async delete(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @PathParams("themeAreaId") themeAreaId: number
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        await this.projectRepository.findByContext(projectId, context);
        
        const projectThemeArea = await this.projectThemeAreaRepository.findByProject(themeAreaId, projectId);
        if (!projectThemeArea) {
            throw new NotFound("PrjectThemeArea not found.");
        }
        await this.projectThemeAreaRepository.delete({ projectId, themeAreaId });

        return ResultContent.of().withMessage("ProjectThemeAreas successfully delete!");
    }

}
