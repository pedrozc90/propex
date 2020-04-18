import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "extension_lines" })
export class ExtensionLine extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "number" })
    @Column({ name: "number", type: "int", width: 11, nullable: false })
    public number: number;

    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "operationWay" })
    @Column({ name: "operation_way", type: "longtext", nullable: false })
    public operationWay: string;

    @ManyToMany(() => Project, (project) => project.extensionLines)
    public projects: Project[];

}
