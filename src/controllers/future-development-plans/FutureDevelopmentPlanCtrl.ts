import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { FutureDevelopmentPlanRepository, ProjectRepository } from "../../repositories";
import { FutureDevelopmentPlan, Page } from "../../entities";
import { Context } from "../../core/models";

@Controller("/future-development-plans")
export class FutureDevelopmentPlanCtrl {

    constructor(private futureDevelopmentPlanRepository: FutureDevelopmentPlanRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of future development plans.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project_id") projectId?: number
    ): Promise<Page<FutureDevelopmentPlan>> {
        return this.futureDevelopmentPlanRepository.fetch(page, rpp, q, projectId);
    }

    /**
     * Save/Update a plan.
     * @param context                       -- user context.
     * @param plans                         -- future development plan data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @BodyParams("futureDevelopmentPlan") futureDevelopmentPlan: FutureDevelopmentPlan
    ): Promise<FutureDevelopmentPlan> {
        const project = await this.projectRepository.findByContext(futureDevelopmentPlan.project.id, context);

        futureDevelopmentPlan.project = project;
        return this.futureDevelopmentPlanRepository.save(futureDevelopmentPlan);
    }

    /**
     * Save/Update a plan.
     * @param context                       -- user context.
     * @param plans                         -- future development plan data.
     */
    @Put("")
    @Authenticated({})
    public async update(
        @Req() request: Req,
        @Required() @BodyParams("futureDevelopmentPlan") data: FutureDevelopmentPlan
    ): Promise<FutureDevelopmentPlan> {
        if (!data.id) {
            throw new BadRequest(`Please use POST ${request.path} to create a new future development plan.`);
        }

        // check if its already exists
        let futureDevelopmentPlan = await this.futureDevelopmentPlanRepository.findOne(data.id);
        if (!futureDevelopmentPlan) {
            throw new NotFound("Future development plan not found.");
        }

        // update fields
        futureDevelopmentPlan = this.futureDevelopmentPlanRepository.merge(futureDevelopmentPlan, data);

        return this.futureDevelopmentPlanRepository.save(futureDevelopmentPlan);
    }

    /**
     * Search a future development plan by id.
     * @param id                            -- future development plan id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<FutureDevelopmentPlan | undefined> {
        return this.futureDevelopmentPlanRepository.findById(id);
    }

    /**
     * Delete a future development plan.
     * @param id                            -- future development plan id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.futureDevelopmentPlanRepository.deleteById(id);
    }

}
