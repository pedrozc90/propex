import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { HumanResourceType } from "../entities";

@EntityRepository(HumanResourceType)
export class HumanResourceTypeRepository extends GenericRepository<HumanResourceType> {
    
    public async init(): Promise<any> {
        const hrt = [];
        hrt[0] = new HumanResourceType();
        hrt[0].description = "Informar coordenador e professores com horas/aula e/ou voluntários";

        hrt[1] = new HumanResourceType();
        hrt[1].description = "Discentes com bolsa";
        
        hrt[2] = new HumanResourceType();
        hrt[2].description = "Discentes sem bolsa";

        return this.save([ ...hrt ]);
    }
    
}
