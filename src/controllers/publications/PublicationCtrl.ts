import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, $log } from "@tsed/common";
import { Exception, NotImplemented } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { PublicationRepository, ProjectRepository } from "../../repositories";
import { Publication } from "../../entities";
import { IContext, PublicationType } from "../../core/types";

@Controller("/publications")
export class PublicationCtrl {

    constructor(private publicationRepository: PublicationRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of publications.
     */
    @Get("")
    @Authenticated({})
    public async fetch(): Promise<any> {
        throw new NotImplemented("Method Not Implemented!");
    }

    /**
     * Create/Update a publication.
     * @param context                       -- user context.
     * @param publication                   -- publication data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("publication") publication: Publication
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(publication.project.id, context);
        if (!project) {
            throw new Exception(400, "Project not found.");
        }
        $log.error("Method Not Implemented", context, publication);
        throw new NotImplemented("Method Not Implemented!");
    }

    /**
     * Return a list of publications.
     */
    @Get("/types")
    @Authenticated({})
    public async listTypes(): Promise<PublicationType[]> {
        return PublicationType.list;
    }

    /**
     * Search for publication information by id.
     * @param id                            -- publication id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Publication | undefined> {
        return this.publicationRepository.findById(id);
    }

    /**
     * Delete a publication information.
     * @param id                            -- publication id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.publicationRepository.deleteById(id);
    }

}
