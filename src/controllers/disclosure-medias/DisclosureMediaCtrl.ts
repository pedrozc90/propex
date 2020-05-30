import { Controller, Get, PathParams, Delete, Required, BodyParams, Post } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";

import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia } from "../../entities";
import { CustomAuth } from "../../services";

@Controller("/disclosure-medias")
export class DisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository,
        private projectRepository: ProjectRepository) {}

    @Post("/")
    @CustomAuth({})
    public async create(@Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia): Promise<DisclosureMedia | undefined> {
        const project = await this.projectRepository.findById(disclosureMedia.project.id);
        if (!project) {
            throw new BadRequest("Project not found!");
        }
        disclosureMedia.project = project;
        return this.disclosureMediaRepository.save(disclosureMedia);
    }

    @Get("/:id")
    @CustomAuth({})
    public async get(@PathParams("id") id: number): Promise<DisclosureMedia | undefined> {
        return this.disclosureMediaRepository.findById(id);
    }

    @Delete("/:id")
    @CustomAuth({})
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.disclosureMediaRepository.deleteById(id);
    }

    // /**
    //  * Delete a disclosure media that belongs to a project.
    //  * @param context                   -- user context.
    //  * @param projectId                 -- project id.
    //  * @param disclosureMediaId         -- disclosure media id
    //  */
    // @Delete("/:id/disclosure-medias/:dm_id")
    // @CustomAuth({ scope: [ "ADMIN", "COORDINATOR" ] })
    // public async deleteDisclosureMedia(
    //     @Locals("context") context: IContext,
    //     @PathParams("id") projectId: number,
    //     @PathParams("dm_id") disclosureMediaId: number
    // ): Promise<any> {
    //     const result = await this.DisclosureMediaRepository.createQueryBuilder().delete()
    //         .where("id = :disclosureMediaId AND project_id = :projectId", { disclosureMediaId, projectId })
    //         .execute();
        
    //     if (result.affected === 0) {
    //         throw new BadRequest(`Disclosure Media ${disclosureMediaId} not found.`);
    //     }
    //     return { messagte: `Disclosure Media ${disclosureMediaId} was successfully deleted.` };
    // }

}
