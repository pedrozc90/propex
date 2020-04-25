import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Partner } from "../entities";

@EntityRepository(Partner)
export class PartnerRepository extends GenericRepository<Partner> {
    
    public async init(): Promise<any> {
        return {};
    }
    
}
