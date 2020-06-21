import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia, Page, ResultContent } from "../../entities";
import { IContext } from "../../core/types";

import moment from "moment";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/disclosure-medias")
@MergeParams(true)
export class ProjectDisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a paginated list of disclosure medias that belongs to a project.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async getDisclosureMedia(@Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string
    ): Promise<Page<DisclosureMedia>> {
        return this.disclosureMediaRepository.fetch(page, rpp, q, date, from, to, projectId);
    }

    /**
     * Create/Update disclosure medias from a project.
     * @param id                            -- project id
     * @param disclosureMedias              -- disclosure medias data.
     */
    @Post("")
    @Authenticated({})
    public async setDisclosureMedia(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("disclosureMedias") disclosureMedias: DisclosureMedia[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        // update existing entities
        let mediasToUpdate = await Promise.all(
            disclosureMedias.filter((dm) => !!dm.id).map(async (dm) => {
                const tmp = await this.disclosureMediaRepository.findOne({ id: dm.id });
                if (!tmp) {
                    throw new NotFound(`Disclosure media ${dm.id} do not exists.`);
                }
                return this.disclosureMediaRepository.merge(tmp, dm);
            })
        );
        
        if (mediasToUpdate.length > 0) {
            mediasToUpdate = await this.disclosureMediaRepository.save(mediasToUpdate);
        }

        // save new entities
        let mediasToInsert = disclosureMedias.filter((d) => !d.id).map((d) => {
            d.project = project;
            if (!d.date) d.date = moment().format("YYYY-MM-DD").toString();
            return d;
        });
        if (mediasToInsert.length > 0) {
            mediasToInsert = await this.disclosureMediaRepository.save(mediasToInsert);
        }

        const result = {
            updated: mediasToUpdate.length || 0,
            inserted: mediasToInsert.length || 0
        };

        return ResultContent.of<any>(result).withMessage("Disclosure Medias successfully updated!");
    }

}
