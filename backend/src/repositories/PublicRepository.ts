import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { Public } from "../entities";

@EntityRepository(Public)
export class PublicRepository extends GenericRepository<Public> {
    
    public async init(): Promise<any> {
        const data = [
            "Escolas públicas",
            "Escolas particulares",
            "Associações",
            "Pequenos produtores",
            "Pessoas com deficiência",
            "Negros/Índios/Quilombolas",
            "Adolescentes em conflito com a lei",
            "Indivíduos apenados e/ou egressos do sistema penitenciário",
            "Indivíduos em situação de rua (moradores de rua)",
            "Migrantes/Imigrantes",
            "Família",
            "Usuários de substâncias psicoativas",
            "Comunidades locais",
            "Comunidade científica",
            "Lideranças Locais",
            "Moradores de área de ocupação",
            "Outras ONG’s",
            "Organizações/movimentos populares",
            "Outros"
        ];

        const publics = data.map((value) => {
            const p = new Public();
            p.name = value;
            return p;
        });

        return this.save([ ...publics ]);
    }

}
