import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, Unique, Index, ManyToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Index("idx_partners_project_id", [ "project" ])
@Unique("uk_partners_email", [ "email" ])
@Entity({ name: "partners" })
export class Partner extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 128, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "contact" })
    @Column({ name: "contact", type: "varchar", length: 128, nullable: false })
    public contact: string;

    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", length: 128, nullable: false })
    public email: string;

    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 20, nullable: false })
    public phone: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.partners, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;
    
}
