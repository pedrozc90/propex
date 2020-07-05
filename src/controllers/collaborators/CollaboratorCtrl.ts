import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, QueryParams } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { ProjectRepository, CollaboratorRepository } from "../../repositories";
import { Collaborator, ResultContent, Page } from "../../entities";

@Controller("/collaborators")
export class CollaboratorCtrl {

    constructor(
        private collaboratorRepository: CollaboratorRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a paginates list of collaborators.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string.
     * @param projectId                     -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Collaborator>> {
        const collaborators = await this.collaboratorRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Collaborator>(collaborators, page, rpp);
    }

    /**
     * Create/Update a collaborator.
     * @param context                       -- user context.
     * @param collaborator                  -- collaborator data.
     */
    @Post("")
    @Authenticated({})
    public async save(@Required() @BodyParams("collaborator") collaborator: Collaborator): Promise<ResultContent<Collaborator>> {
        let clb = await this.collaboratorRepository.findById(collaborator.id);
        if (!clb) {
            throw new NotFound("Collaborator not found.");
        }

        clb = this.collaboratorRepository.merge(clb, collaborator);
        clb = await this.collaboratorRepository.save(clb);

        return ResultContent.of<Collaborator>(clb).withMessage("Collaborator successfully saved.");
    }

    /**
     * Search for collaborator information by id.
     * @param id                            -- collaborator id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Collaborator | undefined> {
        return this.collaboratorRepository.findById(id);
    }

    /**
     * Delete a collaborator information.
     * @param id                            -- collaborator id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.collaboratorRepository.deleteById(id);
    }

}
