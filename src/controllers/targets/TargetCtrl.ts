import { Controller, Get, PathParams, Delete, Required, Post, BodyParams, Locals, QueryParams } from "@tsed/common";
import { Exception } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { TargetRepository, ProjectRepository } from "../../repositories";
import { Target, ResultContent, Page } from "../../entities";
import { AgeRange } from "../../core/types";
import { Context } from "../../core/models";

@Controller("/targets")
export class TargetCtrl {

    constructor(
        private targetRepository: TargetRepository,
        private projectRepository: ProjectRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a list of targets.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Target>> {
        const targets = await this.targetRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Target>(targets, page, rpp);
    }

    /**
     * Create/Update a target.
     * @param context                       -- user context.
     * @param target                        -- target data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @BodyParams("target") target: Target
    ): Promise<ResultContent<Target>> {
        // check if user is part of project.
        const project = await this.projectRepository.findByContext(target.project.id, context);

        let t = await this.targetRepository.createQueryBuilder("t")
            .innerJoin("t.project", "p", "p.id = :projectId", { projectId: project.id })
            .where("t.id = :id OR t.age_range = :ageRange", { id: target.id, ageRange: target.ageRange.key })
            .getOne();

        if (!t) {
            t = this.targetRepository.create(target);
            t.project = project;
        } else {
            if (target.id && target.id !== t.id) {
                throw new Exception(500, `A target with ${t.ageRange.key} already exists with the id ${t.id}`);
            }
            t = this.targetRepository.merge(t, target);
        }
        t = await this.targetRepository.save(t);
        
        return ResultContent.of<Target>(t).withMessage("Target successfully saved.");
    }

    /**
     * Return a list of targets.
     */
    @Get("/age-ranges")
    @Authenticated({})
    public async listTypes(): Promise<AgeRange[]> {
        return AgeRange.list;
    }

    /**
     * Search for target information by id.
     * @param id                            -- target id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Target | undefined> {
        return this.targetRepository.findById(id);
    }

    /**
     * Delete a target information.
     * @param id                            -- target id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.targetRepository.deleteById(id);
    }

}
