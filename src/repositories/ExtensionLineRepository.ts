import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine } from "../entities";
import { Like } from "typeorm";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {
    
    public async init(): Promise<any> {
        const data = [
            {
                number: 1,
                name: "2006 – Alfabetização, leitura e escrita",
                operation: "Alfabetização e letramento de crianças, jovens e adultos;formação do leitor e do produtor de textos; incentivo à leitura; literatura; desenvolvimento de metodologias de ensino da leitura e da escrita e sua inclusão nos projetos político-pedagógicos das escolas."
            },
            {
                number: 2,
                name: "2006 – Artes cênicas",
                operation: "Dança, teatro, técnicas circenses, performance; formação, capacitação e qualificação de pessoas que atuam na área; memória, produção e difusão cultural e artística."
            },
            {
                number: 10,
                name: "2006 – Desenvolvimento tecnológico",
                operation: "Processos de investigação e produção de novas tecnologias, técnicas, processos produtivos, padrões de consumo e produção (inclusive tecnologias sociais, práticas e protocolos de produção de bens e serviços); serviços tecnológicos; estudos de viabilidade técnica, financeira e econômica; adaptação de tecnologias."
            },
            {
                number: 28,
                name: "2006 – Inovação tecnológica",
                operation: "Introdução de produtos ou processos tecnologicamente novos e melhorias significativas a serem implementadas em produtos ou processos existentes nas diversas áreas do conhecimento; considera-se uma inovação tecnológica de produto ou processo aquela que tenha sido implementada e introduzida no mercado (inovação de produto) ou utilizada no processo de produção (inovação de processo)."
            },
            {
                number: 39,
                name: "2006 – Propriedade intelectual e patente",
                operation: "Processos de identificação, regulamentação e registro de direitos autorais e sobre propriedade intelectual e patente."
            },
            {
                number: 50,
                name: "2006 – Temas específicos / Desenvolvimento humano",
                operation: "Temas das diversas áreas do conhecimento, especialmente de ciências humanas, biológicas, sociais aplicadas, exatas e da terra, da saúde, ciências agrárias, engenharias, lingüística, (letras e artes), visando a reflexão, discussão, atualização e aperfeiçoamento humano."
            },
            {
                number: 53,
                name: "2006 – Uso de drogas e dependência química",
                operation: "Prevenção e limitação da incidência e do consumo de drogas; tratamento de dependentes; assistência e orientação a usuários de drogas; recuperação e reintegração social."
            }
        ];

        const lines = data.map((d) => {
            const t = new ExtensionLine();
            t.number = d.number;
            t.name = d.name;
            t.operation = d.operation;
            return t;
        });

        return this.save(lines);
    }

    public async list(options: any): Promise<ExtensionLine[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { operation: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }

}
