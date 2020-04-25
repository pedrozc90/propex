import { Property, Required, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "event_presentations" })
@Index("idx_project_id", [ "project" ])
export class EventPresentation extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Format("date")
    @Property({ name: "date" })
    @Column({ name: "date", type: "date", nullable: false })
    public date: string;

    @Required()
    @Property({ name: "modality" })
    @Column({ name: "modality", type: "varchar", length: 255, nullable: false })
    public modality: string;

    @ManyToOne(() => Project, (project) => project.eventPresentations, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
