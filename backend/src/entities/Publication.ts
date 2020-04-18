import { Property, Required } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { Attachment } from "./Attachment";
import { PublicationTypeEnum } from "../types";

@Entity({ name: "publications" })
export class Publication extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "type" })
    @Column({ name: "type", type: "enum", enum: PublicationTypeEnum, nullable: false })
    public type: PublicationTypeEnum;

    @Required()
    @Property({ name: "title" })
    @Column({ name: "title", type: "varchar", length: 255, nullable: false })
    public title: string;

    @Required()
    @Property({ name: "journalName" })
    @Column({ name: "journal_name", type: "varchar", length: 255, nullable: false })
    public journalName: string;

    @Required()
    @Property({ name: "link" })
    @Column({ name: "link", type: "varchar", length: 255, nullable: false })
    public link: string;

    @ManyToOne(() => Project, (project) => project.publications, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @ManyToOne(() => Attachment, (attachment) => attachment.publications, { nullable: false })
    @JoinColumn({ name: "attachment_id", referencedColumnName: "id" })
    public attachment: Attachment;

}
