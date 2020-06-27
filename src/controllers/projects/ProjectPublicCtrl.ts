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
    public async create(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectPublics") projectPublics: ProjectPublic[]
    ): Promise<ResultContent<ProjectPublic[]>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        projectPublics = await Promise.all(projectPublics.map(async (pb: ProjectPublic) => {
            const p = await this.publicRepository.findOne({ id: pb.public.id });
            if (!p) {
                throw new NotFound("Public not found");
            }

            let t = await this.projectPublicRepository.findOne({ projectId, publicId: p.id });
            if (!t) {
                t = this.projectPublicRepository.create(pb);
                t.project = project;
            } else {
                t = this.projectPublicRepository.merge(t, pb);
            }
            t.public = p;

            return t;
        }));

        projectPublics = await this.projectPublicRepository.save(projectPublics);

        return ResultContent.of<ProjectPublic[]>(projectPublics)
            .withMessage("Project public sucessfully saved!");
    }

    /**
     * Overwrite project_public relationship.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param projectPublics                -- project_public data.
     */
    @Put("")
    @Authenticated({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async update(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectPublics") projectPublics: ProjectPublic[]
    ): Promise<ResultContent<any>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(projectId, context);
        
        const ids = projectPublics.map((v) => v.public.id || v.publicId);

        // find project_public to delete
        const toDelete = await this.projectPublicRepository.find({ projectId, publicId: Not(In(ids)) });
        
        if (toDelete.length > 0) {
            await this.projectPublicRepository.delete({ projectId, publicId: In(toDelete.map((v) => v.publicId)) });
        }

        // find project_public to update
        const toUpdate = await this.projectPublicRepository.find({ projectId, publicId: In(ids) });

        toUpdate.map(async (pb) => {
            const index = projectPublics.findIndex((v) => (v.public.id === pb.publicId || v.publicId === pb.publicId));
            if (index >= 0) {
                pb = this.projectPublicRepository.merge(pb, projectPublics[index]);
                pb = await this.projectPublicRepository.save(pb);
                projectPublics.splice(index, 1);
            }
        });

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
