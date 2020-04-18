import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Demand } from "../entities";

@EntityRepository(Demand)
export class DemandRepository extends GenericRepository<Demand> {
    
    public async init(): Promise<any> {
        return null;
    }

}
