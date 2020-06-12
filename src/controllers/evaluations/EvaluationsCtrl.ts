import { Controller, Get, PathParams, Delete, Required, Locals, QueryParams, Post, BodyParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import { EvaluationRepository } from "../../repositories";
import { Evaluation } from "../../entities";
import { IContext } from "../../types";

@Controller("/evaluations")
export class EvaluationCtrl {

    constructor(private evaluationRepository: EvaluationRepository) {}

    /**
     * Return a list of evaluations.
     * @param context                       -- user context.
     * @param project                       -- project id or title.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(
        @Locals("context") context: IContext,
        @QueryParams("q") q?: string,
        @QueryParams("project") project?: number | string
    ): Promise<Evaluation[]> {
        let query = this.evaluationRepository.createQueryBuilder("ev")
            .innerJoin("ev.project", "project");

        if (q) {
            query = query.where(`ev.description LIKE '%${q}%'`);
        }

        if (project) {
            if (typeof project === "string") {
                query = query.where("project.title LIKE :title", { title: `%${project}%` });
            } else if (typeof project === "number") {
                query = query.where("project.id = : id", { id: project });
            }
        }

        return query.getMany();
    }

    /**
     * Save/Update a evaluation.
     * @param context                       -- user context.
     * @param evaluations                   -- evaluation data.
     */
    @Post("")
    @CustomAuth({})
    public async save(@Required() @BodyParams("evaluation") evaluation: Evaluation): Promise<Evaluation> {
        return this.evaluationRepository.save(evaluation);
    }

    /**
     * Search a evaluation by id.
     * @param id                            -- evaluation id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Evaluation | undefined> {
        return this.evaluationRepository.findById(id);
    }

    /**
     * Delete a evaluation.
     * @param id                            -- evaluation id.
     */
    @Delete("/:id")
    @CustomAuth({ scope: [ "ADMIN", "COORDINATOR" ] })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.evaluationRepository.deleteById(id);
    }

}
