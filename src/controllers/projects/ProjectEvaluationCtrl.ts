import { $log, BodyParams, Controller, Get, Locals, MergeParams, PathParams, Post, QueryParams, Required, UseBeforeEach } from "@tsed/common";

import { NotImplemented } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { EvaluationRepository, ProjectRepository } from "../../repositories";
import { Evaluation, Page } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/evaluations")
@MergeParams(true)
export class ProjectEvaluationCtrl {

    constructor(private evaluationRepository: EvaluationRepository, private projectRepository: ProjectRepository) {
        // initialize stuff here
    }

    /**
     * Return a paginated list of evaluations.
     * @param context                       -- user context.
     * @param projectId                     -- projectr id.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     */
    @Get("")
    @Authenticated({})
    public async getEvaluation(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15
    ): Promise<Page<Evaluation>> {
        const project = await this.projectRepository.findByContext(projectId, context);

        const query = this.evaluationRepository.createQueryBuilder("evaluation")
            .innerJoin("evaluation.project", "p", "p.id = :projectId", { projectId: project.id });

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Evaluation>(await query.getMany(), page, rpp);
    }

    @Post("")
    @Authenticated({})
    public async postEvaluation(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("evaluations") evaluations: Evaluation[]
    ): Promise<any> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        $log.debug(project, evaluations);

        throw new NotImplemented("Method Not Implmented.");
    }

}
