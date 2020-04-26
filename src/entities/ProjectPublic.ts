import { Property, Required } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { Public } from "./Public";

@Entity({ name: "project_publics" })
export class ProjectPublic extends Audit {

    // @Property({ name: "id" })
    // @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    // public id!: number;

    @Required()
    @Property({ name: "directly" })
    @Column({ name: "directly", type: "boolean", default: false, nullable: false })
    public directly: boolean;

    @Required()
    @Property({ name: "otherPublicTitle" })
    @Column({ name: "other_public_title", type: "varchar", length: 255 })
    public otherPublicTitle: number;

    @Required()
    @Property({ name: "otherPublicCras" })
    @Column({ name: "other_public_cras", type: "varchar", length: 255 })
    public otherPublicCras: number;
    
    @ManyToOne(() => Project, (project) => project.projectPublics, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    @PrimaryColumn({ name: "project_id", type: "bigint", unsigned: true, nullable: false })
    public project: Project;

    @Property({ name: "public" })
    @ManyToOne(() => Public, (p) => p.projectPublics, { nullable: false })
    @JoinColumn({ name: "public_id", referencedColumnName: "id" })
    @PrimaryColumn({ name: "public_id", type: "bigint", unsigned: true, nullable: false })
    public public: Public;

}
