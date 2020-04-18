import { Property, Required } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from ".";
import { Public } from "./Public";

@Entity({ name: "project_publics" })
export class ProjectPublic extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;

    @Required()
    @Property({ name: "directly" })
    @Column({ name: "directly", type: "boolean", nullable: false })
    public directly: boolean;

    @Required()
    @Property({ name: "otherPublicTitle" })
    @Column({ name: "other_public_title", type: "varchar", length: 255, nullable: false })
    public otherPublicTitle: number;

    @Required()
    @Property({ name: "otherPublicCras" })
    @Column({ name: "other_public_cras", type: "varchar", length: 255, nullable: false })
    public otherPublicCras: number;
    
    @ManyToOne(() => Project, (project) => project.projectThemeAreas, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @ManyToOne(() => Public, (p) => p.projectPublics, { nullable: false })
    @JoinColumn({ name: "public_id", referencedColumnName: "id" })
    public public: Public;

}
