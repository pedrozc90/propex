import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { Audit } from "./generics/Audit";

@Entity({ name: "extension_lines" })
export class ExtensionLines extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "lineNumber" })
    @Column({ name: "line_number", type: "int", nullable: false })
    public lineNumber: number;

    @Required()
    @Property({ name: "lineName" })
    @Column({ name: "line_name", type: "varchar", length: 255, nullable: false })
    public lineName: String;

    @Required()
    @Property({ name: "operationWay" })
    @Column({ name: "operation_way", type: "longtext", nullable: false })
    public operationWay: String;

}

// INSERT INTO `extension_lines` (id, line_number, line_name, operation_way, createAt, updatedAt)
//     VALUES (1, 1, '2006 – Alfabetização, leitura e escrita',
//     `Alfabetização e letramento de crianças, jovens e adultos;\r\n
//     formação do leitor e do produtor de textos; incentivo à\r\n
//     leitura; literatura; desenvolvimento de metodologias de\r\n
//     ensino da leitura e da escrita e sua inclusão nos projetos\r\n
//     político-pedagógicos das escolas.`, NULL, NULL);