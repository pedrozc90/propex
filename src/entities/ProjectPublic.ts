import { Property, Required, Default } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { Public } from "./Public";

@Index("idx_project_publics_project_id", [ "project" ])
@Index("idx_project_publics_public_id", [ "public" ])
@Entity({ name: "project_publics" })
export class ProjectPublic extends Audit {

    @PrimaryColumn({ name: "project_id", type: "bigint", unsigned: true, nullable: false })
    public projectId: number;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.projectPublics, { primary: true })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @PrimaryColumn({ name: "public_id", type: "bigint", unsigned: true, nullable: false })
    public publicId: number;

    @Property({ name: "public" })
    @ManyToOne(() => Public, (p) => p.projectPublics, { primary: true })
    @JoinColumn({ name: "public_id", referencedColumnName: "id" })
    public public: Public;

    @Required()
    @Default(false)
    @Property({ name: "directly" })
    @Column({ name: "directly", type: "boolean", default: false, nullable: false })
    public directly: boolean = false;

    @Required()
    @Property({ name: "othersTitle" })
    @Column({ name: "others_title", type: "varchar", length: 255, nullable: true })
    public otherPublicTitle: number;

    @Required()
    @Property({ name: "othersCras" })
    @Column({ name: "others_cras", type: "varchar", length: 255, nullable: true })
    public otherPublicCras: number;
    
}
