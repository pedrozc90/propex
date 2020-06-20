import { Controller, Get, PathParams, Delete, Required, QueryParams, Post, BodyParams } from "@tsed/common";

import { CustomAuth } from "../../services";
import { EvaluationRepository } from "../../repositories";
import { Evaluation, Page } from "../../entities";

@Controller("/evaluations")
export class EvaluationCtrl {

    constructor(private evaluationRepository: EvaluationRepository) {}

    /**
     * Return a paginated list of Evaluations.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string.
     * @param project                       -- project id or title.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") project?: number | string
    ): Promise<Page<Evaluation>> {
        return this.evaluationRepository.fetch({ page, rpp, q, project });
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
