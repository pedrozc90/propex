import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { DisclosureMedia, Page, ResultContent } from "../../entities";
import { IContext } from "../../core/types";

import { StringUtils } from "../../core/utils";

import moment from "moment";

@Controller("/:projectId/disclosure-medias")
@MergeParams(true)
export class ProjectDisclosureMediaCtrl {

    constructor(
        private DisclosureMediaRepository: Repo.DisclosureMediaRepository,
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    /**
     * Return a paginated list of disclosure medias that belongs to a project.
     * @param id                            -- project id.
     */
    @Get("")
    @CustomAuth({})
    public async getDisclosureMedia(@Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string
    ): Promise<Page<DisclosureMedia>> {
        const query = this.DisclosureMediaRepository.createQueryBuilder("dm")
            .innerJoin("dm.project", "p", "p.id = :projectId", { projectId });
        
        if (StringUtils.isNotEmpty(q)) {
            query.where("dm.name LIKE :name", { name: `%${q}%` })
                .orWhere("dm.link LIKE :link", { link: `%${q}%` });
        }

        if (date) query.where("dm.date = :date", { date });
        if (from) query.where("dm.date >= :from", { from });
        if (to) query.where("dm.date <= :to", { to });

        query.orderBy("dm.date", "DESC")
            .skip((page - 1) * rpp)
            .take(rpp);
        
        return Page.of<DisclosureMedia>(await query.getMany(), page, rpp);
    }

    /**
     * Create/Update disclosure medias from a project.
     * @param id                            -- project id
     * @param disclosureMedias              -- disclosure medias data.
     */
    @Post("")
    @CustomAuth({})
    public async setDisclosureMedia(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("disclosureMedias") disclosureMedias: DisclosureMedia[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.ProjectRepository.findByContext(projectId, context);

        // update existing entities
        let mediasToUpdate = await Promise.all(
            disclosureMedias.filter((dm) => !!dm.id).map(async (dm) => {
                const tmp = await this.DisclosureMediaRepository.findOne({ id: dm.id });
                if (!tmp) {
                    throw new NotFound(`Disclosure media ${dm.id} do not exists.`);
                }
                return this.DisclosureMediaRepository.merge(tmp, dm);
            })
        );
        
        if (mediasToUpdate.length > 0) {
            mediasToUpdate = await this.DisclosureMediaRepository.save(mediasToUpdate);
        }

        // save new entities
        let mediasToInsert = disclosureMedias.filter((d) => !d.id).map((d) => {
            d.project = project;
            if (!d.date) d.date = moment().format("YYYY-MM-DD").toString();
            return d;
        });
        if (mediasToInsert.length > 0) {
            mediasToInsert = await this.DisclosureMediaRepository.save(mediasToInsert);
        }

        const result = {
            updated: mediasToUpdate.length || 0,
            inserted: mediasToInsert.length || 0
        };

        return ResultContent.of<any>(result).withMessage("Disclosure Medias successfully updated!");
    }

}
