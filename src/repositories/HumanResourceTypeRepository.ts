import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { HumanResourceType } from "../entities";

@EntityRepository(HumanResourceType)
export class HumanResourceTypeRepository extends GenericRepository<HumanResourceType> {
    
    public async init(): Promise<any> {
        const data = [
            "Informar coordenador e professores com horas/aula e/ou voluntários",
            "Discentes com bolsa",
            "Discentes sem bolsa"
        ];

        const hrts = data.map((d) => {
            const t = new HumanResourceType();
            t.description = d;
            return t;
        });

        return this.save([ ...hrts ]);
    }
    
}
