import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { DisclosureMedia } from "../entities";

@EntityRepository(DisclosureMedia)
export class DisclosureMediaRepository extends GenericRepository<DisclosureMedia> {

}
