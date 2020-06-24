import { Controller, Get, PathParams, Delete, Required, BodyParams, Post, Locals, QueryParams, Put, Req } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";

import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia, Page } from "../../entities";
import { Authenticated } from "../../core/services";
import { Context } from "../../core/models";

@Controller("/disclosure-medias")
export class DisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository, private projectRepository: ProjectRepository) {}
    
    /**
     * Return a list of disclosure medias.
     * @param context                       -- user context.
     * @param project                       -- project title or id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(@Locals("context") context: Context,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string,
        @QueryParams("project_id") projectId?: number
    ): Promise<Page<DisclosureMedia>> {
        return this.disclosureMediaRepository.fetch(page, rpp, q, date, from, to, projectId);
    }

    /**
     * Create/Update a disclosure media.
     * @param context                       -- user context/
     * @param disclosureMedia               -- disclosure media data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Req() request: Req,
        @Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia
    ): Promise<DisclosureMedia | undefined> {
        const project = await this.projectRepository.findByContext(disclosureMedia.project.id, context);

        let dm = await this.disclosureMediaRepository.findOne({ id: disclosureMedia.id });
        if (dm) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a disclosure media data.`);
        }

        dm = this.disclosureMediaRepository.create(disclosureMedia);
        dm.project = project;

        return this.disclosureMediaRepository.save(dm);
    }

    /**
     * Create/Update a disclosure media.
     * @param context                       -- user context/
     * @param disclosureMedia               -- disclosure media data.
     */
    @Put("")
    @Authenticated({})
    public async update(
        @Locals("context") context: Context,
        @Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia
    ): Promise<DisclosureMedia | undefined> {
        await this.projectRepository.findByContext(disclosureMedia.project.id, context);
        
        let dm = await this.disclosureMediaRepository.findOne({ id: disclosureMedia.id });
        if (!dm) {
            throw new NotFound("Disclouse media not found.");
        }
        dm = this.disclosureMediaRepository.merge(dm, disclosureMedia);
        return this.disclosureMediaRepository.save(dm);
    }

    /**
     * Search for a disclosure media by id.
     * @param id                            -- disclosure media id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<DisclosureMedia | undefined> {
        return this.disclosureMediaRepository.findById(id);
    }

    /**
     * Delete a disclosure media.
     * @param id                            -- disclosure media id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.disclosureMediaRepository.deleteById(id);
    }

}
