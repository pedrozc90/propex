import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Collaborator } from "../entities";

@EntityRepository(Collaborator)
export class CollaboratorRepository extends GenericRepository<Collaborator> {

}
