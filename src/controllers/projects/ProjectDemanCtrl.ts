import { Controller, Get, PathParams, Required, MergeParams, Locals, UseBeforeEach, Post, BodyParams, QueryParams } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { DemandRepository, ProjectRepository } from "../../repositories";
import { Demand, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/demands")
@MergeParams(true)
export class ProjectDemanCtrl {

    constructor(private demandRepository: DemandRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of demands for a current project.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string (look for description or justification)
     */
    @Get("")
    @Authenticated({})
    public async get(@Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Demand>> {
        // check if user is part of the current project.
        const project = await this.projectRepository.findByContext(projectId, context);

        const demands = await this.demandRepository.fetch({ page, rpp, q, projectId: project.id });

        return Page.of<Demand>(demands, page, rpp);
    }

    /**
     * Create/Update a demand.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param demand                        -- demand data.
     */
    @Post("")
    @Authenticated({})
    public async save(@Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("demand") demand: Demand
    ): Promise<ResultContent<Demand>> {
        // check if user is part of the current project.
        const project = await this.projectRepository.findByContext(projectId, context);

        let dm = await this.demandRepository.findByProject(demand.id, project.id);
        if (!dm) {
            dm = this.demandRepository.create(demand);
            dm.project = project;
        } else {
            dm = this.demandRepository.merge(dm, demand);
        }

        dm = await this.demandRepository.save(dm);

        return ResultContent.of<Demand>(dm).withMessage("Demand successfully saved.");
    }

}
