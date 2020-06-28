import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, TargetRepository } from "../../repositories";
import { Target, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { Exception } from "@tsed/exceptions";

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
    public async getTargets(@PathParams("projectId") projectId: number): Promise<{ targets: Target[], totalNumberOfMen: number, totalNumberOfWomen: number, total: number }> {
        const query = this.targetRepository.createQueryBuilder("pt")
            .innerJoin("pt.project", "p", "p.id = :projectId", { projectId });
        
        const targets = await query.getMany();

        let { totalNumberOfMen, totalNumberOfWomen } = await query.select("COALESCE(SUM(pt.men_number), 0)", "totalNumberOfMen")
            .addSelect("COALESCE(SUM(pt.women_number), 0)", "totalNumberOfWomen")
            .getRawOne();
        totalNumberOfMen = parseInt(totalNumberOfMen);
        totalNumberOfWomen = parseInt(totalNumberOfWomen);
        const total = totalNumberOfMen + totalNumberOfWomen;

        return { targets, totalNumberOfMen, totalNumberOfWomen, total };
    }

    /**
     * Create/Update project targets.
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

        for (let target of targets) {
            let t = await this.targetRepository.createQueryBuilder("t")
                .innerJoin("t.project", "p", "p.id = :projectId", { projectId: project.id })
                .where("t.id = :id OR t.age_range = :ageRange", { id: target.id, ageRange: target.ageRange.key })
                .getOne();
            
            if (!t) {
                t = this.targetRepository.create(target);
                t.project = project;
            } else {
                if (target.id && target.id !== t.id) {
                    throw new Exception(500, `A target with ${t.ageRange.key} already exists with the id ${t.id}`);
                }
                t = this.targetRepository.merge(t, target);
            }
            t = await this.targetRepository.save(t);

            target = t;
        }

        return ResultContent.of<Target[]>(targets).withMessage("Target successfully saved.");
    }

}
