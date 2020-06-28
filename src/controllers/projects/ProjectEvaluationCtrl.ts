import { Controller, Get, Locals, MergeParams, PathParams, QueryParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { EvaluationRepository, ProjectRepository } from "../../repositories";
import { Evaluation, Page } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/evaluations")
@MergeParams(true)
export class ProjectEvaluationCtrl {

    constructor(
        private evaluationRepository: EvaluationRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
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
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Evaluation>> {
        // check if user if part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);

        const evaluations = await this.evaluationRepository.fetch({ page, rpp, q, projectId: project.id });

        return Page.of<Evaluation>(evaluations, page, rpp);
    }

}
