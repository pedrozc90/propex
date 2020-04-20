import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ThemeArea } from "../entities";

@EntityRepository(ThemeArea)
export class ThemeAreaRepository extends GenericRepository<ThemeArea> {
    
    public async init(): Promise<any> {
        const data = [
            "Comunicação",
            "Meio Ambiente",
            "Cultura",
            "Saúde",
            "Direitos Humanos e Justiça",
            "Tecnologia e Produção",
            "Educação",
            "Trabalho"
        ];

        const areas = data.map((value) => {
            const a = new ThemeArea();
            a.name = value;
            return a;
        });

        return this.save([ ...areas ]);
    }

}
