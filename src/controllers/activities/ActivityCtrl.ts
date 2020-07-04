import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { ActivityRepository, ProjectRepository, AttachmentRepository } from "../../repositories";
import { Activity, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";

@Controller("/activities")
export class ActivityCtrl {

    constructor(
        private activityRepository: ActivityRepository,
        private projectRepository: ProjectRepository,
        private attachmentRepository: AttachmentRepository) {
        // initialize your stuffs here
    }

    /**
     * Return a list of activities.
     * @param context                       -- user context.
     * @param project                       -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(@Locals("context") context: Context,
        @QueryParams("project") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 1,
        @QueryParams("q") q?: string
    ): Promise<Page<Activity>> {
        const activities = await this.activityRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Activity>(activities, page, rpp);
    }

    /**
     * Create/Update a new activity.
     * @param context                       -- user context.
     * @param activity                      -- activity data.
     */
    @Post("")
    @Authenticated({})
    public async create(
        @Locals("context") context: Context,
        @Req() request: Req,
        @Required() @BodyParams("activity") data: Activity
    ): Promise<ResultContent<Activity>> {
        // check if user is part of current project.
        const project = await this.projectRepository.findByContext(data.project.id, context);

        let activity = await this.activityRepository.findOne({ id: data.id });
        if (!activity) {
            activity = this.activityRepository.create(data);
            activity.project = project;
        } else {
            activity = this.activityRepository.merge(activity, data);
        }
       
        activity = await this.activityRepository.save(activity);

        // FIXME: NAO SEI SE VALE APENA
        // if (activity.attachments) {
        //     await this.projectRepository.createQueryBuilder("p").relation("attachments").of(project).add(activity.attachments.map((att) => att.id));
        // }

        return ResultContent.of<Activity>(activity)
            .withMessage("Activity successfully saved.");
    }

    // /**
    //  * Update an activity.
    //  * @param context                       -- user context.
    //  * @param activity                      -- activity data.
    //  */
    // @Put("")
    // @Authenticated({})
    // public async update(
    //     @Locals("context") context: Context,
    //     @Required() @BodyParams("activity") data: Activity
    // ): Promise<ResultContent<Activity>> {
    //     // check if user is part of current project.
    //     await this.projectRepository.findByContext(data.project.id, context);

    //     let activity = await this.activityRepository.findOne({ id: data.id });
    //     if (!activity) {
    //         throw new NotFound("Activity not found.");
    //     }

    //     activity = this.activityRepository.merge(activity, data);
    //     activity = await this.activityRepository.save(activity);

    //     return ResultContent.of<Activity>(activity)
    //         .withMessage("Activity successfully updated.");
    // }

    /**
     * Search an activity by id.
     * @param id                            -- activity id.
     */
    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Activity | undefined> {
        return this.activityRepository.findById(id);
    }

    /**
     * Delete an activity.
     * @param id                            -- activity id.
     */
    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        const activity = await this.activityRepository.findOne({
            where: { id },
            join: {
                alias: "a",
                leftJoinAndSelect: { attachments: "a.attachments" }
            }
        });
        if (!activity) {
            throw new NotFound("Activity not found.");
        }
        if (activity.attachments) {
            await this.attachmentRepository.delete(activity.attachments.map((att) => att.id));
        }
        return this.activityRepository.deleteById(activity.id);
    }

}
