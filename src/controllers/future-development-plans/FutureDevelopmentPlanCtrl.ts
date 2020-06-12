import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";
import { Exception } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { FutureDevelopmentPlanRepository, ProjectRepository } from "../../repositories";
import { FutureDevelopmentPlan } from "../../entities";
import { IContext } from "../../types";

@Controller("/future-development-plans")
export class FutureDevelopmentPlanCtrl {

    constructor(private planRepository: FutureDevelopmentPlanRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of future development plans.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @QueryParams("q") q: string
    ): Promise<FutureDevelopmentPlan[]> {
        let query = this.planRepository.createQueryBuilder("ep");

        if (q) {
            query = query.where("ep.activities LIKE :activities", { activities: `%${q}%` })
                .orWhere("ep.expected_results LIKE :expectedResults", { expectedResults: `%${q}%` });
        }

        return query.getMany();
    }

    /**
     * Save/Update a plan.
     * @param context                       -- user context.
     * @param plans                         -- future development plan data.
     */
    @Post("")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("plan") plan: FutureDevelopmentPlan
    ): Promise<FutureDevelopmentPlan> {
        const project = await this.projectRepository.findByContext(plan.project.id, context);
        if (!project) {
            throw new Exception(400, "Project not found.");
        }
        plan.project = project;
        return this.planRepository.save(plan);
    }

    /**
     * Search a future development plan by id.
     * @param id                            -- future development plan id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<FutureDevelopmentPlan | undefined> {
        return this.planRepository.findById(id);
    }

    /**
     * Delete a future development plan.
     * @param id                            -- future development plan id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.planRepository.deleteById(id);
    }

}
