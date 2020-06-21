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
    @Authenticated({})
    public async save(
        @Req() request: Req,
        @Locals("context") context: Context,
        @Required() @BodyParams("demand") data: Demand
    ): Promise<ResultContent<Demand>> {
        // check if user is part of project
        const project = await this.projectRepository.findByContext(data.project.id, context);

        let demand = await this.demandRepository.findOne({
            where: {
                id: data.id,
                project: { id: project.id }
            },
            join: {
                alias: "d",
                innerJoin: { project: "d.project" }
            }
        });

        if (demand) {
            throw new BadRequest(`Please use PUT ${request.path} to update a existing demand.`);
        }

        demand = this.demandRepository.create(data);
        demand.project = project;
        demand = await this.demandRepository.save(demand);

        return ResultContent.of<Demand>(demand).withMessage("Demand sucessfully saved.");
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
        @Required() @BodyParams("demand") data: Demand
    ): Promise<ResultContent<Demand>> {
        // check if user is part of project
        const project = await this.projectRepository.findByContext(data.project.id, context);

        let demand = await this.demandRepository.findOne({
            where: {
                id: data.id,
                project: { id: project.id }
            },
            join: {
                alias: "d",
                innerJoin: { project: "d.project" }
            }
        });

        if (!demand) {
            throw new NotFound("Demand not found.");
        }
        
        // merge changes
        demand = this.demandRepository.merge(demand, data);

        // update demand
        demand = await this.demandRepository.save(demand);

        return ResultContent.of<Demand>(demand).withMessage("Demand sucessfully saved.");
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
