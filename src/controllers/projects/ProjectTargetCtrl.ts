import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Target, ResultContent } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/:projectId/targets")
@MergeParams(true)
export class ProjectTargetCtrl {

    constructor(
        private ProjectRepository: Repo.ProjectRepository,
        private TargetRepository: Repo.TargetRepository) {
        // initialize stuff here
    }

    /**
     * Return the list of targets witch the project attends.
     * @param id                            -- project id.
     */
    @Get("")
    @CustomAuth({})
    public async getTargets(@PathParams("projectId") projectId: number): Promise<{ targets: Target[], total: number }> {
        const query = this.TargetRepository.createQueryBuilder("pt")
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
    @CustomAuth({})
    public async setTargets(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("targets") targets: Target[]
    ): Promise<any> {
        // select project if user is part of it.
        const project = await this.ProjectRepository.findByContext(projectId, context);

        // update project target based on receiver array, and return the new array of targets.
        const savedTargets = await this.TargetRepository.overwrite(project, targets);

        return ResultContent.of<Target[]>(savedTargets).withMessage("Target successfully saved.");
    }

}
