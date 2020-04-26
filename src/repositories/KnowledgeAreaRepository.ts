import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea } from "../entities";

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {
    
}
