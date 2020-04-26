import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Public } from "../entities";

@EntityRepository(Public)
export class PublicRepository extends GenericRepository<Public> {

}
