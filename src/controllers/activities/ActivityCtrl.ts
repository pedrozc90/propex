import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";

import { Authenticated } from "../../core/services";
import { ActivityRepository } from "../../repositories";
import { Activity } from "../../entities";
import { Context } from "../../core/models";

@Controller("/activities")
export class ActivityCtrl {

    constructor(private activityRepository: ActivityRepository) {}

    /**
     * Return a list of Activitys.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @Locals("context") context: Context,
        @QueryParams("project") project: number | string
    ): Promise<Activity[]> {
        const query = this.activityRepository.createQueryBuilder("activity")
            .innerJoin("activity.project", "project");

        // project = JSON.parse(project as string);
        if (typeof project === "string") {
            query.where("project.title LIKE :title", { title: `%${project}%` });
        } else if (typeof project === "number") {
            query.where("project.id = :id", { id: project });
        }

        return query.getMany();
    }

    /**
     * Save/Update a Activity.
     * @param context                       -- user context.
     * @param Activitys                   -- Activity data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Locals("context") context: Context,
        @Required() @BodyParams("activity") activity: Activity
    ): Promise<Activity> {
        return this.activityRepository.save(activity);
    }

    /**
     * Search a Activity by id.
     * @param id                            -- Activity id.
     */
    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Activity | undefined> {
        return this.activityRepository.findById(id);
    }

    /**
     * Delete a Activity.
     * @param id                            -- evalutaion id.
     */
    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.activityRepository.deleteById(id);
    }

}
