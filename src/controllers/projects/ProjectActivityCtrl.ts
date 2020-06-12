import { Controller, Get, QueryParams, PathParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Page, Activity } from "../../entities";

@Controller("/:projectId/activities")
@MergeParams(true)
export class ProjectActivityCtrl {

    constructor(
        private ActivityRepository: Repo.ActivityRepository) {
        // initialize stuff here
    }

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
    @CustomAuth({})
    public async getActivities(@Required() @PathParams("projectId") projectId: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("init_date") initDate?: string,
        @QueryParams("last_date") lastDate?: string
    ): Promise<Page<Activity>> {
        let query = this.ActivityRepository.createQueryBuilder("activity")
            .innerJoin("activity.project", "project", "project.id = :projectId", { projectId });

        if (q) {
            query = query.where("activity.name LIKE :name", { name: `%${q}%` })
                .orWhere("activity.description LIKE :description", { description: `%${q}%` });
        }

        if (initDate) query = query.where(`activity.date > ${initDate}`);
        if (lastDate) query = query.where(`activity.date < ${lastDate}`);

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

}
