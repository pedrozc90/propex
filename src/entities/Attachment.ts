import { Property, Required, Enum } from "@tsed/common";
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
    public id!: number;
    
    @Required()
    @Enum(AttachmentType)
    @Property({ name: "type" })
    // @Column({ name: "type", type: "enum", enum: AttachmentTypeEnum, nullable: false })
    @Column({ name: "type", type: "varchar", transformer: AttachmentTypeEnumTransformer, nullable: false })
    public type: AttachmentType;

    @Required()
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 255, nullable: false })
    public url: string;

    @Required()
    @Property({ name: "originalFilename" })
    @Column({ name: "original_filename", type: "varchar", length: 255, nullable: false })
    public originalFilename: string;

    @Required()
    @Property({ name: "originalFileSize" })
    @Column({ name: "original_file_size", type: "double", precision: 8, scale: 2, nullable: false })
    public originalFileSize: number;

    @Required()
    @Property({ name: "filename" })
    @Column({ name: "filename", type: "varchar", length: 255, nullable: false })
    public filename: string;

    @Required()
    @Property({ name: "fileSize" })
    @Column({ name: "file_size", type: "double", precision: 8, scale: 2, nullable: false })
    public fileSize: number;

    @OneToMany(() => Publication, (publication) => publication.attachment)
    public publications: Publication[];

    @ManyToMany(() => Activity, (activity) => activity.attachments)
    public activities: Activity[];

    @ManyToMany(() => Project, (project) => project.activities)
    public projects: Project[];

}
