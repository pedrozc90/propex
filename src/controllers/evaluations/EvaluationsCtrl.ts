import { Controller, Get, PathParams, Delete, Required, QueryParams, Post, BodyParams } from "@tsed/common";

import { Authenticated } from "../../core/services";
import { EvaluationRepository } from "../../repositories";
import { Evaluation, Page, ResultContent } from "../../entities";

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
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<Evaluation>> {
        const evaluations = await this.evaluationRepository.fetch({ page, rpp, q, projectId });
        return Page.of<Evaluation>(evaluations, page, rpp);
    }

    /**
     * Save/Update a evaluation.
     * @param context                       -- user context.
     * @param evaluations                   -- evaluation data.
     */
    @Post("")
    @Authenticated({})
    public async save(@Required() @BodyParams("evaluation") evaluation: Evaluation): Promise<ResultContent<Evaluation>> {
        let e = await this.evaluationRepository.findOne({ id: evaluation.id });
        if (!e) {
            e = this.evaluationRepository.create(evaluation);
        } else {
            e = this.evaluationRepository.merge(e, evaluation);
        }
        e = await this.evaluationRepository.save(e);
        return ResultContent.of<Evaluation>(evaluation).withMessage("Evaluation successfully saved.");
    }

    /**
     * Search a evaluation by id.
     * @param id                            -- evaluation id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Evaluation | undefined> {
        return this.evaluationRepository.findById(id);
    }

    /**
     * Delete a evaluation.
     * @param id                            -- evaluation id.
     */
    @Delete("/:id")
    @Authenticated({ scope: [ "ADMIN", "COORDINATOR" ] })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.evaluationRepository.deleteById(id);
    }

}
