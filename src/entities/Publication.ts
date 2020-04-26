import { Property, Required, Enum } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { Attachment } from "./Attachment";
import { PublicationType } from "../types";
import { PublicationTypeEnumTransformer } from "../utils";

@Entity({ name: "publications" })
@Index("idx_project_id", [ "project" ])
@Index("idx_attachment_id", [ "attachment" ])
export class Publication extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Enum(PublicationType)
    @Property({ name: "type" })
    // @Column({ name: "type", type: "enum", enum: PublicationTypeEnum, nullable: false })
    @Column({ name: "type", type: "varchar", length: 255, transformer: PublicationTypeEnumTransformer, nullable: false })
    public type: PublicationType;

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

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.publications, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @Property({ name: "attachment" })
    @ManyToOne(() => Attachment, (attachment) => attachment.publications, { nullable: true })
    @JoinColumn({ name: "attachment_id", referencedColumnName: "id" })
    public attachment: Attachment;

}
