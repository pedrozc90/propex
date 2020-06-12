import { Controller, Get, PathParams, Delete, Required, BodyParams, Post, Locals, QueryParams } from "@tsed/common";

import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia, Page } from "../../entities";
import { CustomAuth } from "../../services";
import { IContext } from "../../types";

@Controller("/disclosure-medias")
export class DisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository, private projectRepository: ProjectRepository) {}
    
    /**
     * Return a list of disclosure medias.
     * @param context                       -- user context.
     * @param project                       -- project title or id.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(@Locals("context") context: IContext,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string,
        @QueryParams("project") project?: number | string
    ): Promise<Page<DisclosureMedia>> {
        let query = this.disclosureMediaRepository.createQueryBuilder("dm")
            .innerJoin("dm.project", "p");
        
        if (q) {
            query = query.where("dm.name LIKE :name", { name: `%${q}%` })
                .orWhere("dm.link LIKE :link", { name: `%${q}%` });
        }

        if (date) query = query.where("dm.date = :date", { date });
        if (from) query = query.where("dm.date >= :from", { from });
        if (to) query = query.where("dm.date <= :to", { to });

        if (project) {
            if (typeof project === "string") {
                query = query.where("project.title LIKE :title", { title: `%${project}%` });
            } else if (typeof project === "number") {
                query = query.where("project.id = : id", { id: project });
            }
        }

        query = query.orderBy("dm.date", "DESC")
            .skip((page - 1) * rpp)
            .take(rpp);

        return Page.of<DisclosureMedia>(await query.getMany(), page, rpp);
    }

    /**
     * Create/Update a disclosure media.
     * @param context                       -- user context/
     * @param disclosureMedia               -- disclosure media data.
     */
    @Post("")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia
    ): Promise<DisclosureMedia | undefined> {
        const project = await this.projectRepository.findByContext(disclosureMedia.project.id, context);
        disclosureMedia.project = project;
        return this.disclosureMediaRepository.save(disclosureMedia);
    }

    /**
     * Search for a disclosure media by id.
     * @param id                            -- disclosure media id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<DisclosureMedia | undefined> {
        return this.disclosureMediaRepository.findById(id);
    }

    /**
     * Delete a disclosure media.
     * @param id                            -- disclosure media id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.disclosureMediaRepository.deleteById(id);
    }

}
