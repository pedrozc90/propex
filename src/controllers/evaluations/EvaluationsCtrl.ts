import { Controller, Get, PathParams, Delete } from "@tsed/common";

import { EvaluationRepository } from "../../repositories";
import { Evaluation } from "../../entities";

@Controller("/evaluations")
export class EvaluationCtrl {

    constructor(private evaluationRepository: EvaluationRepository) {}

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Evaluation | undefined> {
        return this.evaluationRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.evaluationRepository.deleteById(id);
    }

}
