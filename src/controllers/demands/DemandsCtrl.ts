import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import { DemandRepository, ProjectRepository } from "../../repositories";
import { Demand, ResultContent, Page } from "../../entities";
import { IContext } from "../../core/types";

@Controller("/demands")
export class DemandCtrl {

    constructor(private demandRepository: DemandRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of demands.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(@Locals("context") context: IContext,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") project?: number | string
    ): Promise<Page<Demand>> {
        const query = this.demandRepository.createQueryBuilder("demand");

        if (project) {
            if (typeof project === "string") {
                query.innerJoin("demand.project", "project", "project.title LIKE :title", { title: `%${project}%` });
            } else if (typeof project === "number") {
                query.innerJoin("demand.project", "project", "project.id = : id", { id: project });
            }
        }

        if (q) {
            query.where("demand.description LIKE :description", { description: `%${q}%` })
                .orWhere("demand.justification LIKE :justification", { justification: `%${q}%` });
        }

        query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Demand>(await query.getMany(), page, rpp);
    }

    /**
     * create a new demand.
     * @param context                       -- user context.
     * @param demands                       -- demand data.
     */
    @Post("")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("demand") demand: Demand
    ): Promise<ResultContent<Demand>> {
        // check if  porject exists
        const project = await this.projectRepository.findByContext(demand.project.id, context);

        // save demand
        demand.project = project;
        demand = await this.demandRepository.save(demand);

        return ResultContent.of<Demand>(demand).withMessage("Demand sucessfully saved.");
    }

    /**
     * Search a demand by id.
     * @param id                            -- demand id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Demand | undefined> {
        return this.demandRepository.findById(id);
    }

    /**
     * Delete a demand.
     * @param id                            -- demand id.
     */
    @Delete("/:id")
    @CustomAuth({})
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.demandRepository.deleteById(id);
    }

}
