import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, QueryParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Partner, Page } from "../../entities";
import { IContext } from "../../types";

@Controller("/:projectId/partners")
@MergeParams(true)
export class ProjectPartnerCtrl {

    constructor(private PartnerRepository: Repo.PartnerRepository, private ProjectRepository: Repo.ProjectRepository) {}

    @Get("")
    @CustomAuth({})
    public async getParterns(@Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Partner>> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        return this.PartnerRepository.fetch({ page, rpp, q, project: project.id });
    }

    @Post("")
    @CustomAuth({})
    public async postParterns(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("partners") partners: Partner[]
    ): Promise<Partner[]> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        partners.map((p) => {
            p.project = project;
            return p;
        });

        return this.PartnerRepository.save(partners);
    }

}
