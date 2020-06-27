import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, QueryParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { PartnerRepository, ProjectRepository } from "../../repositories";
import { Partner, Page } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/partners")
@MergeParams(true)
export class ProjectPartnerCtrl {

    constructor(private partnerRepository: PartnerRepository, private projectRepository: ProjectRepository) {}

    @Get("")
    @Authenticated({})
    public async getParterns(@Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Partner>> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        return this.partnerRepository.fetch({ page, rpp, q, project: project.id });
    }

    @Post("")
    @Authenticated({})
    public async postParterns(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("partners") partners: Partner[]
    ): Promise<Partner[]> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        partners.map((p) => {
            p.project = project;
            return p;
        });

        return this.partnerRepository.save(partners);
    }

}
