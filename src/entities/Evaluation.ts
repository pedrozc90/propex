import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Index("idx_evaluations_project_id", [ "project" ])
@Entity({ name: "evaluations" })
export class Evaluation extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "longtext", nullable: false })
    public description: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.evaluations)
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
