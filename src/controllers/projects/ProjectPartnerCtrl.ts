import { Controller, Locals, Get, Post, PathParams, BodyParams, Required, $log, MergeParams } from "@tsed/common";
import { NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Partner } from "../../entities";
import { IContext } from "../../types";

@Controller("/:projectId/partners")
@MergeParams(true)
export class ProjectPartnerCtrl {

    constructor(
        private ProjectRepository: Repo.ProjectRepository) {
        // initialize stuff here
    }

    @Get("")
    @CustomAuth({})
    public async getParterns(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number): Promise<Partner[]> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        $log.debug(project);
        
        throw new NotImplemented("Method Not Implemented.");
    }

    @Post("")
    @CustomAuth({})
    public async postParterns(
        @Locals("context") context: IContext,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("partners") partners: Partner[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(projectId, context);
        
        $log.debug(project, partners);

        throw new NotImplemented("Method Not Implemented.");
    }

}
