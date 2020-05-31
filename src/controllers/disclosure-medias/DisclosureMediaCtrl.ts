import { Controller, Get, PathParams, Delete, Required, BodyParams, Post, Locals, QueryParams } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";

import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia } from "../../entities";
import { CustomAuth } from "../../services";
import { IContext } from "src/types";

@Controller("/disclosure-medias")
export class DisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository, private projectRepository: ProjectRepository) {}
    
    /**
     * Return a list of disclosure medias.
     * @param context                       -- user context.
     * @param project                       -- project title or id.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @Required() @QueryParams("project") project: number
    ): Promise<DisclosureMedia[]> {
        return this.disclosureMediaRepository.createQueryBuilder("dm")
            .innerJoin("dm.project", "p", "p.id = :projectId", { projectId: project })
            .getMany();
    }

    /**
     * Create/Update a disclosure media.
     * @param context                       -- user context/
     * @param disclosureMedia               -- disclosure media data.
     */
    @Post("/")
    @CustomAuth({})
    public async create(
        @Locals("context") context: IContext,
        @Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia
    ): Promise<DisclosureMedia | undefined> {
        const project = await this.projectRepository.findByContext(disclosureMedia.project.id, context);
        if (!project) {
            throw new BadRequest("Project not found!");
        }
        disclosureMedia.project = project;
        return this.disclosureMediaRepository.save(disclosureMedia);
    }

    /**
     * Search for a disclosure media by id.
     * @param id                            -- disclosure media id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@PathParams("id") id: number): Promise<DisclosureMedia | undefined> {
        return this.disclosureMediaRepository.findById(id);
    }

    /**
     * Delete a disclosure media.
     * @param id                            -- disclosure media id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.disclosureMediaRepository.deleteById(id);
    }

}
