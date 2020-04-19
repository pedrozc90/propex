import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "knowledge_areas" })
export class KnowledgeArea extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @ManyToMany(() => Project, (project) => project.knowledgeAreas)
    public projects: Project[];

}
