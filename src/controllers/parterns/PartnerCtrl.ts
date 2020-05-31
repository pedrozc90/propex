import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals } from "@tsed/common";
import { BadRequest, Exception, NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { PartnerRepository, ProjectRepository } from "../../repositories";
import { Partner } from "../../entities";
import { IContext } from "src/types";

@Controller("/partners")
export class PartnerCtrl {

    constructor(private partnerRepository: PartnerRepository, private proejctRepository: ProjectRepository) {}

    @Get("/")
    @CustomAuth({})
    public async fetch(): Promise<any> {
        throw new NotImplemented("Method Not Implemented!");
    }

    @Post("/")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("partner") partner: Partner
    ): Promise<any> {
        if (!partner.project || !partner.project.id) {
            throw new BadRequest("Partner is not related to any project.");
        }

        // check if user is part of project.
        const project = await this.proejctRepository.findByContext(partner.project.id, context);
        if (!project) {
            throw new Exception(400, "Project not found.");
        }
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
