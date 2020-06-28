import { isBoolean } from "@tsed/core";
import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams, UseBeforeEach, Put, Delete } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { In, Not } from "typeorm";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, PublicRepository, ProjectPublicRepository } from "../../repositories";
import { ResultContent, ProjectPublic } from "../../entities";
import { Context } from "../../core/models";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/publics")
@MergeParams(true)
export class ProjectPublicCtrl {

    constructor(
        private projectRepository: ProjectRepository,
        private projectPublicRepository: ProjectPublicRepository,
        private publicRepository: PublicRepository) {
        // initialize stuff here
    }

    /**
     * Return all publics from a given project.
     * @param id                            -- project id.
     * @param directly                      -- filter direct publics.
     */
    @Get("")
    @Authenticated({})
    public async get(
        @Required() @PathParams("projectId") projectId: number,
        @QueryParams("directly") directly?: boolean
    ): Promise<ProjectPublic[]> {
        const query = this.projectPublicRepository.createQueryBuilder("pb")
            .innerJoinAndSelect("pb.public", "public");
        
        query.where("pb.project_id = :projectId", { projectId });

        if (isBoolean(directly)) {
            query.andWhere("pb.directly = :directly", { directly: (directly) ? 1 : 0 });
        }

        return query.getMany();
    }

    /**
     * Create/Update public to project relationship.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param projectPublics                -- project public data array.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectPublics") projectPublics: ProjectPublic[]
    ): Promise<ResultContent<ProjectPublic[]>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        let toInsert: ProjectPublic[] = [];

        for (const pb of projectPublics) {
            // current public id
            const publicId: number = (pb.public) ? pb.public.id : pb.publicId;

            const p = await this.publicRepository.findOne({ id: publicId });
            if (!p) {
                throw new NotFound(`Public ${pb.public.name || publicId} not found`);
            }

            let tmp = await this.projectPublicRepository.findOne({ projectId, publicId: p.id });
            if (!tmp) {
                tmp = this.projectPublicRepository.create(pb);
                tmp.project = project;
            } else {
                tmp = this.projectPublicRepository.merge(tmp, pb);
            }
            tmp.public = p;

            toInsert.push(tmp);
        }

        toInsert = await this.projectPublicRepository.save(toInsert);

        return ResultContent.of<ProjectPublic[]>(toInsert)
            .withMessage("Project public sucessfully saved!");
    }

    /**
     * Overwrite all realtionship between project and theme areas.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param projectPublics                -- project_public data.
     */
    @Put("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async overwrite(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectPublics") projectPublics: ProjectPublic[]
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        const ids = projectPublics.map((v) => (v.public) ? v.public.id : v.publicId);

        // find project_public to delete
        const toDelete = await this.projectPublicRepository.find({ projectId, publicId: Not(In(ids)) });
        
        if (toDelete.length > 0) {
            // await this.projectPublicRepository.delete({ projectId, publicId: In(toDelete.map((v) => v.publicId)) });
            await this.projectPublicRepository.remove(toDelete);
        }

        // find project_public to update
        const toUpdate = await this.projectPublicRepository.find({ projectId, publicId: In(ids) });

        if (toUpdate.length > 0) {
            for (let pb of toUpdate) {
                const index = projectPublics.findIndex((v) => ((v.public && v.public.id === pb.publicId) || v.publicId === pb.publicId));
                if (index >= 0) {
                    pb = this.projectPublicRepository.merge(pb, projectPublics[index]);
                    pb = await this.projectPublicRepository.save(pb);
                    projectPublics.splice(index, 1);
                }
            }
        }

        // create new ones
        let toInsert = projectPublics.map((pb) => {
            pb.project = project;
            return this.projectPublicRepository.create(pb);
        });

        if (toInsert.length > 0) {
            toInsert = await this.projectPublicRepository.save(toInsert);
        }

        return ResultContent.of({ deleted: toDelete, updated: toUpdate, inserted: toInsert }).withMessage("Project publics successfully saved!");
    }

    @Delete("/:publicId")
    @Authenticated({})
    public async delete(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @PathParams("publicId") publicId: number
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        await this.projectRepository.findByContext(projectId, context);
        
        await this.projectPublicRepository.delete({ projectId, publicId });

        return ResultContent.of().withMessage("Project public successfully delete!");
    }

}
