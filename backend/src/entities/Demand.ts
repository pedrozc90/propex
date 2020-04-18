import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "demands" })
@Index("idx_project_id", [ "project" ])
export class Demand extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;

    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @Required()
    @Property({ name: "justification" })
    @Column({ name: "justification", type: "longtext", nullable: false })
    public justification: string;

    @Required()
    @Property({ name: "contact" })
    @Column({ name: "contact", type: "varchar", length: 255, nullable: false })
    public contact: string;

    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 255, nullable: false })
    public phone: string;

    @ManyToOne(() => Project, (project) => project.demands, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;
    
}
