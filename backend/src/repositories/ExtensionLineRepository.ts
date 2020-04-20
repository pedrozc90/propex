import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine } from "../entities";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {
    
    public async init(): Promise<any> {
        const el = new ExtensionLine();
        el.number = 1;
        el.name = "2006 – Alfabetização, leitura e escrita";
        el.operation = `Alfabetização e letramento de crianças, jovens e adultos;\r\n
            formação do leitor e do produtor de textos; incentivo à\r\n
            leitura; literatura; desenvolvimento de metodologias de\r\n
            ensino da leitura e da escrita e sua inclusão nos projetos\r\n
            político-pedagógicos das escolas.`;

        return this.save([ el ]);
    }

}
