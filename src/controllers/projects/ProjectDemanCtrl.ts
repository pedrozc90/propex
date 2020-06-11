import { Controller, Get, PathParams, Required, MergeParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Demand } from "../../entities";

@Controller("/:projectId/demands")
@MergeParams(true)
export class ProjectDemanCtrl {

    constructor(
        private DemandRepository: Repo.DemandRepository) {
        // initialize stuff here
    }

    /**
     * Return a list of disclosure medias that belongs to a project.
     * @param id                -- project id.
     */
    @Get("/")
    @CustomAuth({})
    public async getDemands(
        @Required() @PathParams("projectId") projectId: number
    ): Promise<Demand[]> {
        return this.DemandRepository.createQueryBuilder("d")
            .innerJoin("d.project", "p", "p.id = :projectId", { projectId })
            .getMany();
    }

}
