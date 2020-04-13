import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { DisclosureMedia } from "./DisclosureMedia";
import { EventPresentation } from "./EventPresentation";
import { Project } from "./Project";

@Entity({ name: "finished_projects" })
export class FinishedProject extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "evaluation" })
    @Column({ name: "evaluation", type: "longtext", nullable: false })
    public evaluation: string;

    @OneToOne(() => Project, (project) => project.finishedProject)
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
