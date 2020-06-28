import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, MergeParams, QueryParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { PartnerRepository, ProjectRepository } from "../../repositories";
import { Partner, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/partners")
@MergeParams(true)
export class ProjectPartnerCtrl {

    constructor(private partnerRepository: PartnerRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of partners.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string (filter by name, contact, email and phone)
     */
    @Get("")
    @Authenticated({})
    public async getParterns(@Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Partner>> {
        // check if user is part of  current project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        // select partners to the current project.
        const partners = await this.partnerRepository.fetch({ page, rpp, q, projectId: project.id });

        return Page.of<Partner>(partners, page, rpp);
    }

    /**
     * Create/Update partners of a project.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param partner                       -- partner data.
     */
    @Post("")
    @Authenticated({})
    public async postParterns(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("partner") partner: Partner
    ): Promise<ResultContent<Partner>> {
        const project = await this.projectRepository.findByContext(projectId, context);
        
        let pt = await this.partnerRepository.findOne({
            where: {
                id: partner.id,
                project: { id: project.id }
            },
            join: {
                alias: "pt",
                innerJoin: { project: "pt.project" }
            }
        });

        if (!pt) {
            pt = this.partnerRepository.create(partner);
            pt.project = project;
        } else {
            pt = this.partnerRepository.merge(pt, partner);
        }

        pt = await this.partnerRepository.save(pt);

        return ResultContent.of<Partner>(pt).withMessage("Partner successfully saved.");
    }

}
