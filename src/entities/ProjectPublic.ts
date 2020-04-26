import { Property, Required, Default } from "@tsed/common";
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
    @Default(false)
    @Property({ name: "directly" })
    @Column({ name: "directly", type: "boolean", default: false, nullable: false })
    public directly: boolean = false;

    @Required()
    @Property({ name: "othersTitle" })
    @Column({ name: "others_title", type: "varchar", length: 255 })
    public otherPublicTitle: number;

    @Required()
    @Property({ name: "othersCras" })
    @Column({ name: "others_cras", type: "varchar", length: 255 })
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
