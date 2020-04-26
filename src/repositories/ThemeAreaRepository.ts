import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ThemeArea } from "../entities";

@EntityRepository(ThemeArea)
export class ThemeAreaRepository extends GenericRepository<ThemeArea> {

}
