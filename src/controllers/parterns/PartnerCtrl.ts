import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { PartnerRepository } from "../../repositories";
import { Partner, Page } from "../../entities";
import { Context } from "../../core/models";

@Controller("/partners")
export class PartnerCtrl {

    constructor(private partnerRepository: PartnerRepository) {}

    /**
     * Return a paginated list of partners.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string;
     * @param project                       -- project id or title.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Partner>> {
        const partners = await this.partnerRepository.fetch({ page, rpp, q, projectId });

        return Page.of<Partner>(partners, page, rpp);
    }

    /**
     * Create a new partner.
     * @param context                       -- user context.
     * @param request                       -- express request object.
     * @param data                          -- partner data.
     */
    @Post("")
    @Authenticated({})
    public async create(
        @Locals("context") context: Context,
        @Req() request: Req,
        @Required() @BodyParams("partner") partner: Partner
    ): Promise<Partner> {
        const pt = await this.partnerRepository.findMatch(partner, partner.project);
        if (pt) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a partner data.`);
        }
        if (!partner.project) {
            throw new BadRequest("Missing project data.");
        }
        return this.partnerRepository.save(partner);
    }

    /**
     * Update partner data.
     * @param data                          -- partner data.
     */
    @Put("")
    @Authenticated({})
    public async update(@Required() @BodyParams("partner") data: Partner): Promise<any> {
        let partner = await this.partnerRepository.findMatch(data, data.project);
        if (!partner) {
            throw new NotFound("Partner not found.");
        }
        partner = this.partnerRepository.merge(partner, data);
        return this.partnerRepository.save(partner);
    }

    /**
     * Search for partner information by id.
     * @param id                            -- partner id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Partner | undefined> {
        return this.partnerRepository.findById(id);
    }

    /**
     * Delete a partner information.
     * @param id                            -- partner id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.partnerRepository.deleteById(id);
    }

}
