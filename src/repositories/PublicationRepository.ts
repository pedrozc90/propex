import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Publication } from "../entities";

@EntityRepository(Publication)
export class PublicationRepository extends GenericRepository<Publication> {
    
}
