import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Evaluation } from "../entities";

@EntityRepository(Evaluation)
export class EvaluationRepository extends GenericRepository<Evaluation> {

}
