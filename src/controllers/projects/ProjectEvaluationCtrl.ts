import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, $log, MergeParams } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Evaluation, Partner } from "../../entities";
import { IContext } from "../../types";

@Controller("/:projectId/evaluations")
@MergeParams(true)
export class ProjectEvaluationCtrl {

    constructor(
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    @Get("")
    @CustomAuth({})
    public async getEvaluation(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number
    ): Promise<Partner[]> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        $log.debug(project);

        return [];
    }

    @Post("")
    @CustomAuth({})
    public async postEvaluation(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("evaluations") evaluations: Evaluation[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        $log.debug(project, evaluations);

        throw new NotImplemented("Method Not Implmented.");
    }

}
