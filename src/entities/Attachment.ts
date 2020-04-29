import { Property, Required, Enum, Default } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { Publication } from "./Publication";
import { Project } from "./Project";
import { AttachmentType } from "../types";
import { AttachmentTypeEnumTransformer } from "../utils";

@Entity({ name: "attachments" })
export class Attachment extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Required()
    @Enum(AttachmentType)
    @Default(AttachmentType.DOCUMENT)
    @Property({ name: "type" })
    // @Column({ name: "type", type: "enum", enum: AttachmentTypeEnum, nullable: false })
    @Column({ name: "type", type: "varchar", length: 255, transformer: AttachmentTypeEnumTransformer, default: "DOCUMENT", nullable: false })
    public type: AttachmentType = AttachmentType.DOCUMENT;

    @Required()
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 255, nullable: false })
    public url: string;

    @Required()
    @Property({ name: "originalFileName" })
    @Column({ name: "original_file_name", type: "varchar", length: 255, nullable: false })
    public originalFileName: string;

    @Required()
    @Property({ name: "originalFileSize" })
    @Column({ name: "original_file_size", type: "double", precision: 8, scale: 2, nullable: false })
    public originalFileSize: number;

    @Required()
    @Property({ name: "fileName" })
    @Column({ name: "file_name", type: "varchar", length: 255, nullable: false })
    public fileName: string;

    @Required()
    @Property({ name: "fileSize" })
    @Column({ name: "file_size", type: "double", precision: 8, scale: 2, nullable: false })
    public fileSize: number;

    @Property({ name: "publications" })
    @OneToMany(() => Publication, (publication) => publication.attachment)
    public publications: Publication[];

    @Property({ name: "activities" })
    @ManyToMany(() => Activity, (activity) => activity.attachments)
    public activities: Activity[];

    @Property({ name: "projects" })
    @ManyToMany(() => Project, (project) => project.activities)
    public projects: Project[];

}
