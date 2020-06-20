import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { PartnerRepository } from "../../repositories";
import { Partner, Page } from "../../entities";
import { IContext } from "../../core/types";

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
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") project?: string | number
    ): Promise<Page<Partner>> {
        return this.partnerRepository.fetch({ page, rpp, q, project });
    }

    /**
     * Create a new partner.
     * @param context                       -- user context.
     * @param request                       -- express request object.
     * @param data                          -- partner data.
     */
    @Post("")
    @CustomAuth({})
    public async create(
        @Locals("context") context: IContext,
        @Req() request: Req,
        @Required() @BodyParams("partner") data: Partner
    ): Promise<Partner> {
        if (!data.project) {
            throw new BadRequest("Missing project data.");
        }

        const partner = await this.partnerRepository.findMatch(data, data.project);

        if (partner) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a partner data.`);
        }

        return this.partnerRepository.save(data);
    }

    /**
     * Update partner data.
     * @param data                          -- partner data.
     */
    @Put("")
    @CustomAuth({})
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
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Partner | undefined> {
        return this.partnerRepository.findById(id);
    }

    /**
     * Delete a partner information.
     * @param id                            -- partner id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.partnerRepository.deleteById(id);
    }

}
