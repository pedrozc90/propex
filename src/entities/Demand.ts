import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Index("idx_demands_project_id", [ "project" ])
@Entity({ name: "demands" })
export class Demand extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @Required()
    @Property({ name: "justification" })
    @Column({ name: "justification", type: "longtext", nullable: false })
    public justification: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.demands, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;
    
}
