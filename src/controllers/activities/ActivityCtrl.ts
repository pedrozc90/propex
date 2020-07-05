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
        @QueryParams("q") q?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string
    ): Promise<Page<Activity>> {
        const activities = await this.activityRepository.fetch({ page, rpp, q, projectId, from, to });
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

        if (activity.attachments) {
            // populate activity_attachments many-to-many relationship
            for (const attachment of activity.attachments) {
                await this.attachmentRepository.linkActivity(attachment.id, activity.id);
            }
            // populate project_attachments many-to-many relationship
            for (const attachment of activity.attachments) {
                await this.attachmentRepository.linkProject(attachment.id, project.id);
            }
            // avoid saveing again
            delete activity.attachments;
        }

        return ResultContent.of<Activity>(activity)
            .withMessage("Activity successfully saved.");
    }

    /**
     * Search an activity by id.
     * @param id                            -- activity id.
     */
    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Activity | undefined> {
        const activity = await this.activityRepository.findById(id);
        if (!activity) {
            throw new NotFound("Activity not found.");
        }

        // avoid sending files
        if (activity.attachments) {
            delete activity.attachments;
        }

        return activity;
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
            for (const attachment of activity.attachments) {
                await this.attachmentRepository.erase(attachment.id);
            }
        }
        return this.activityRepository.deleteById(activity.id);
    }

    /**
     * Delete an activity.
     * @param id                            -- activity id.
     */
    @Post("/:activityId/attachments/:attachmentId")
    public async setAttachments(
        @PathParams("activityId") activityId: number,
        @PathParams("attachmentId") attachmentId: number
    ): Promise<any> {
        await this.activityRepository.createQueryBuilder("act").relation("attachments").of({ id: activityId }).add({ id: attachmentId });
        return { message: "Attachment atached to activity." };
    }

    /**
     * Delete an activity.
     * @param id                            -- activity id.
     */
    @Delete("/:activityId/attachments/:attachmentId")
    public async deleteAttachments(
        @PathParams("activityId") activityId: number,
        @PathParams("attachmentId") attachmentId: number
    ): Promise<any> {
        const activity = await this.activityRepository.createQueryBuilder("act")
            .innerJoinAndSelect("act.attachments", "att", "att.id = :attachmentId", { attachmentId })
            .where("act.id = :activityId", { activityId })
            .getOne();
        
        if (!activity) {
            throw new NotFound("Activity not found.");
        }

        if (!activity.attachments || activity.attachments.length === 0) {
            throw new NotFound("Attachment is not part of the activity.");
        }

        if (activity.attachments) {
            await this.activityRepository.createQueryBuilder("act").relation("attachments").of(activity).remove(activity.attachments);
        }
        
        return { message: "Attachment detached from activity." };
    }

}
