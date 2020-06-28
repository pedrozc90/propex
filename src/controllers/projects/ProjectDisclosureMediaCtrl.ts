import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { DisclosureMediaRepository, ProjectRepository } from "../../repositories";
import { DisclosureMedia, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/disclosure-medias")
@MergeParams(true)
export class ProjectDisclosureMediaCtrl {

    constructor(private disclosureMediaRepository: DisclosureMediaRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a paginated list of disclosure medias that belongs to a project.
     * @param id                            -- project id.
     */
    @Get("")
    @Authenticated({})
    public async get(@Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string
    ): Promise<Page<DisclosureMedia>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        // select a disclosure medias
        const dms = await this.disclosureMediaRepository.fetch({ page, rpp, q, date, from, to, projectId: project.id });

        return Page.of<DisclosureMedia>(dms, page, rpp);
    }

    /**
     * Create/Update disclosure medias from a project.
     * @param id                            -- project id
     * @param disclosureMedias              -- disclosure medias data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("disclosureMedia") disclosureMedia: DisclosureMedia
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);

        let dm = await this.disclosureMediaRepository.findOne({
            where: {
                id: disclosureMedia.id,
                project: { id: project.id }
            },
            join: {
                alias: "dm",
                innerJoin: { project: "dm.project" }
            }
        });

        if (!dm) {
            dm = this.disclosureMediaRepository.create(disclosureMedia);
            dm.project = project;
        } else {
            dm = this.disclosureMediaRepository.merge(dm, disclosureMedia);
        }

        dm = await this.disclosureMediaRepository.save(dm);

        return ResultContent.of<any>(dm).withMessage("Disclosure Medias successfully updated!");
    }

    // @Put("")
    // @Authenticated({})
    // public async update(
    //     @Locals("context") context: Context,
    //     @Required() @PathParams("projectId") projectId: number,
    //     @Required() @BodyParams("disclosureMedias") disclosureMedias: DisclosureMedia[]
    // ): Promise<any> {
    //     // check if user is part of project.
    //     const project = await this.projectRepository.findByContext(projectId, context);

    //     const ids = disclosureMedias.map((dm) => dm.id).filter(ParseUtils.isEmpty);

    //     // search for entities to delete (exists in the database but no in the received array)
    //     const toDelete = await this.disclosureMediaRepository.find({
    //         where: {
    //             id: Not(In(ids)),
    //             project: { id: project.id }
    //         },
    //         join: {
    //             alias: "dm",
    //             innerJoin: { project: "dm.project" }
    //         }
    //     });

    //     if (toDelete.length > 0) {
    //         await this.disclosureMediaRepository.remove(toDelete);
    //     }

    //     // search for entities to insert (exists on database and in the received array)
    //     const toUpdate = await this.disclosureMediaRepository.find({
    //         where: {
    //             id: In(ids),
    //             project: { id: project.id }
    //         },
    //         join: {
    //             alias: "dm",
    //             innerJoin: { project: "dm.project" }
    //         }
    //     });
 
    //     if (toUpdate.length > 0) {
    //         for (let dm of toUpdate) {
    //             const index = disclosureMedias.findIndex((v) => v.id === dm.id);
    //             if (index >= 0) {
    //                 dm = this.disclosureMediaRepository.merge(dm, disclosureMedias[index]);
    //                 dm = await this.disclosureMediaRepository.save(dm);
    //                 disclosureMedias.splice(index, 1);
    //             }
    //         }
    //     }

    //     // insert the remaining entities in the array.
    //     let toInsert = disclosureMedias.map((dm) => {
    //         dm.project = project;
    //         return this.disclosureMediaRepository.create(dm);
    //     });

    //     if (toInsert.length > 0) {
    //         toInsert = await this.disclosureMediaRepository.save(toInsert);
    //     }

    //     return { inserted: toInsert, updated: toUpdate, deleted: toDelete };
    // }

}
