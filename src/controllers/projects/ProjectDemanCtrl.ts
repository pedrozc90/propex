import { Controller, Get, PathParams, Required, MergeParams, Locals, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { DemandRepository, ProjectRepository } from "../../repositories";
import { Demand } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/demands")
@MergeParams(true)
export class ProjectDemanCtrl {

    constructor(private demandRepository: DemandRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of disclosure medias that belongs to a project.
     * @param id                -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getDemands(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number
    ): Promise<Demand[]> {
        const project = await this.projectRepository.findByContext(projectId, context);

        return this.demandRepository.createQueryBuilder("d")
            .innerJoin("d.project", "p", "p.id = :projectId", { projectId: project.id })
            .getMany();
    }

}
