import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, TargetRepository } from "../../repositories";
import { Target, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/targets")
@MergeParams(true)
export class ProjectTargetCtrl {

    constructor(
        private projectRepository: ProjectRepository,
        private targetRepository: TargetRepository) {
        // initialize your stuffs here
    }

    /**
     * Return the list of targets witch the project attends.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getTargets(@PathParams("projectId") projectId: number): Promise<{ targets: Target[], total: number }> {
        const query = this.targetRepository.createQueryBuilder("pt")
            .innerJoin("pt.project", "p", "p.id = :projectId", { projectId });
        
        const targets = await query.getMany();

        const { total } = await query.select("COALESCE(SUM(pt.men_number) + SUM(pt.women_number), 0)", "total")
            .getRawOne();

        return { targets, total: parseInt(total) };
    }

    /**
     * Returns
     * @param id                            -- project id.
     * @param targets                       -- project targets.
     */
    @Post("")
    @Authenticated({})
    public async setTargets(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("targets") targets: Target[]
    ): Promise<any> {
        // select project if user is part of it.
        const project = await this.projectRepository.findByContext(projectId, context);

        // update project target based on receiver array, and return the new array of targets.
        const savedTargets = await this.targetRepository.overwrite(project, targets);

        return ResultContent.of<Target[]>(savedTargets).withMessage("Target successfully saved.");
    }

}
