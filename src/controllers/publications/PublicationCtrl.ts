import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams } from "@tsed/common";

import { Authenticated } from "../../core/services";
import { PublicationRepository, ProjectRepository, AttachmentRepository } from "../../repositories";
import { Publication, Page, ResultContent } from "../../entities";
import { PublicationType } from "../../core/types";
import { Context } from "../../core/models";
import { NotFound } from "@tsed/exceptions";

@Controller("/publications")
export class PublicationCtrl {

    constructor(
        private publicationRepository: PublicationRepository,
        private projectRepository: ProjectRepository,
        private attachmentREpository: AttachmentRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a list of publications.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<any> {
        const publications = await this.publicationRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Publication>(publications, page, rpp);
    }

    /**
     * Create/Update a publication.
     * @param context                       -- user context.
     * @param publication                   -- publication data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @BodyParams("publication") data: Publication
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(data.project.id, context);
        
        let publication = await this.publicationRepository.findOne({ id: data.id, project: project });
        if (!publication) {
            publication = this.publicationRepository.create(data);
            publication.project = project;
            // create relation between attachment and project
            if (publication.attachment) {
                await this.projectRepository.createQueryBuilder("project").relation("attachments").of(project).add(publication.attachment);
            }
        } else {
            publication = this.publicationRepository.merge(publication, data);
        }
        publication = await this.publicationRepository.save(publication);

        return ResultContent.of<Publication>(publication).withMessage("Publication successfully saved.");
    }

    /**
     * Return a list of publications types.
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
        return this.publicationRepository.findOne({ id }, { relations: [ "attachment" ] });
    }

    /**
     * Delete a publication information.
     * @param id                            -- publication id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        const publication = await this.publicationRepository.findOne({ id }, { relations: [ "attachment" ] });
        if (!publication) {
            throw new NotFound("Publication not found.");
        }
        // delete attachment linked to the publication
        if (publication.attachment) {
            await this.attachmentREpository.deleteById(publication.attachment.id);
        }
        // delete publication
        return this.publicationRepository.deleteById(publication.id);
    }

}
