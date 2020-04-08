import { Property, Required, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "activities" })
export class Activity extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "activity" })
    @Column({ name: "activity", type: "varchar", length: 255, nullable: false })
    public activity: string;

    @Required()
    @Property({ name: "externalActivity" })
    @Column({ name: "external_activity", type: "tinyint", default: 0, nullable: false }) // length: 4
    public externalActivity: number;

    @Required()
    @Property({ name: "numberOfMembers" })
    @Column({ name: "number_of_members", type: "int", default: 0, nullable: false }) // length: 11
    public numberOfMembers: number;

    @Format("date-time")
    @Property({ name: "date" })
    @CreateDateColumn({ name: "date", type: "datetime", nullable: false })
    public date: Date;

    @Required()
    @Property({ name: "period" })
    @Column({ name: "period", type: "int", nullable: false }) // length: 11
    public period: number;

    @Required()
    @Property({ name: "executionWeekday" })
    @Column({ name: "execution_weekday", type: "varchar", length: 255, nullable: false })
    public executionWeekday: string;

    @Format("time")
    @Property({ name: "executionHour" })
    @Column({ name: "execution_hour", type: "time", nullable: false })
    public executionHour: string;

    @Required()
    @Property({ name: "results" })
    @Column({ name: "results", type: "varchar", length: 180, nullable: false })
    public results: string;

    // public project_id bigint(20) unsigned NOT NULL,
    @ManyToOne(() => Project, (project) => project.activities, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
