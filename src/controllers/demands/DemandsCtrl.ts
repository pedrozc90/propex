import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams, Put, Req } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { DemandRepository, ProjectRepository } from "../../repositories";
import { Demand, ResultContent, Page } from "../../entities";
import { Context } from "../../core/models";

@Controller("/demands")
export class DemandCtrl {

    constructor(private demandRepository: DemandRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of demands.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @Authenticated({})
    public async fetch(@Locals("context") context: Context,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Demand>> {
        const demands = await this.demandRepository.fetch({ page, rpp, q, projectId });

        return Page.of<Demand>(demands, page, rpp);
    }

    /**
     * create a new demand.
     * @param context                       -- user context.
     * @param demands                       -- demand data.
     */
    @Post("")
    @Authenticated({})
    public async save(
        @Req() request: Req,
        @Locals("context") context: Context,
        @Required() @BodyParams("demand") demand: Demand
    ): Promise<ResultContent<Demand>> {
        // check if user is part of project
        const project = await this.projectRepository.findByContext(demand.project.id, context);

        let dm = await this.demandRepository.findByProject(demand.id, project.id);

        if (dm) {
            throw new BadRequest(`Please use PUT ${request.path} to update a existing demand.`);
        }

        dm = this.demandRepository.create(demand);
        dm.project = project;
        dm = await this.demandRepository.save(dm);

        return ResultContent.of<Demand>(dm).withMessage("Demand sucessfully saved.");
    }

    /**
     * create a new demand.
     * @param context                       -- user context.
     * @param demands                       -- demand data.
     */
    @Put("")
    @Authenticated({})
    public async update(
        @Locals("context") context: Context,
        @Required() @BodyParams("demand") demand: Demand
    ): Promise<ResultContent<Demand>> {
        // check if user is part of project
        const project = await this.projectRepository.findByContext(demand.project.id, context);

        let dm = await this.demandRepository.findByProject(demand.id, project.id);

        if (!dm) {
            throw new NotFound("Demand not found.");
        }
        
        // merge changes
        dm = this.demandRepository.merge(dm, demand);

        // update dm
        dm = await this.demandRepository.save(dm);

        return ResultContent.of<Demand>(dm).withMessage("Demand sucessfully saved.");
    }

    /**
     * Search a demand by id.
     * @param id                            -- demand id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Demand | undefined> {
        return this.demandRepository.findById(id);
    }

    /**
     * Delete a demand.
     * @param id                            -- demand id.
     */
    @Delete("/:id")
    @Authenticated({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.demandRepository.deleteById(id);
    }

}
