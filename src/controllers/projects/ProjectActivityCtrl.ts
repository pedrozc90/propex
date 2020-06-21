import { Controller, Get, QueryParams, PathParams, Required, MergeParams, UseBeforeEach } from "@tsed/common";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ActivityRepository } from "../../repositories";
import { Page, Activity } from "../../entities";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/activities")
@MergeParams(true)
export class ProjectActivityCtrl {

    constructor(private activityRepository: ActivityRepository) {}

    /**
     * Return a list of activities tied to a project.
     * @param projectId                     -- project id.
     * @param page                          -- page number.
     * @param rpp                           -- row per page.
     * @param q                             -- query string.
     * @param initDate                      -- initial date.
     * @param lastDate                      -- last date.
     */
    @Get("")
    @Authenticated({})
    public async getActivities(@Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("init_date") initDate?: string,
        @QueryParams("last_date") lastDate?: string
    ): Promise<Page<Activity>> {
        const query = this.activityRepository.createQueryBuilder("activity")
            .innerJoin("activity.project", "project", "project.id = :projectId", { projectId });

        if (q) {
            query.where("activity.name LIKE :name", { name: `%${q}%` })
                .orWhere("activity.description LIKE :description", { description: `%${q}%` });
        }

        if (initDate) query.where(`activity.date > ${initDate}`);
        if (lastDate) query.where(`activity.date < ${lastDate}`);

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

}
