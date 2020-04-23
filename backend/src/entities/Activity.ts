import { Property, Required, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Attachment } from "./Attachment";
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
    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @Required()
    @Property({ name: "external" })
    @Column({ name: "external", type: "boolean", default: false, nullable: false })
    public external: number;

    @Required()
    @Property({ name: "numberOfMembers" })
    @Column({ name: "number_of_members", type: "int", width: 11, default: 0, nullable: false })
    public numberOfMembers: number;

    @Format("date")
    @Property({ name: "date" })
    @Column({ name: "date", type: "date", nullable: false })
    public date: string;

    @Required()
    @Property({ name: "period" })
    @Column({ name: "period", type: "int", width: 11, nullable: false })
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

    @ManyToMany(() => Attachment, (attachment) => attachment.activities)
    @JoinTable({
        name: "activity_attachments",
        joinColumn: { name: "attachment_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "activity_id", referencedColumnName: "id" }
    })
    public attachments: Attachment[];

    @ManyToOne(() => Project, (project) => project.activities, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
