import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";
import { Exception } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import { DemandRepository, ProjectRepository } from "../../repositories";
import { Demand } from "../../entities";
import { IContext } from "../../types";

@Controller("/demands")
export class DemandCtrl {

    constructor(private demandRepository: DemandRepository, private projectRepository: ProjectRepository) {}

    /**
     * Return a list of demands.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @Required() @QueryParams("project") project: number | string
    ): Promise<Demand[]> {
        let query = this.demandRepository.createQueryBuilder("d")
            .innerJoin("d.project", "project");

        if (typeof project === "string") {
            query = query.where("project.title LIKE :title", { title: `%${project}%` });
        } else if (typeof project === "number") {
            query = query.where("project.id = : id", { id: project });
        }

        return query.getMany();
    }

    /**
     * Save/Update a demand.
     * @param context                       -- user context.
     * @param demands                       -- demand data.
     */
    @Post("/")
    @CustomAuth({})
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("demand") demand: Demand
    ): Promise<Demand> {
        const project = await this.projectRepository.findByContext(demand.project.id, context);
        if (!project) {
            throw new Exception(400, "Project not found.");
        }
        demand.project = project;
        return this.demandRepository.save(demand);
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
