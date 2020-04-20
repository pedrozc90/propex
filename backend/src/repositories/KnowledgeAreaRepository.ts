import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { KnowledgeArea } from "../entities";

@EntityRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends GenericRepository<KnowledgeArea> {
    
    public async init(): Promise<any> {
        const data = [
            "Ciências Exatas e da Terra",
            "Ciências Biológicas",
            "Engenharia / Tecnologia",
            "Ciências da Saúde",
            "Ciências Agrárias",
            "Ciências Sociais",
            "Ciências Humanas",
            "Lingüística, Letras e Artes"
        ];

        const areas = data.map((value) => {
            const tmp = new KnowledgeArea();
            tmp.name = value;
            return tmp;
        });

        return this.save([ ...areas ]);
    }
    
}
