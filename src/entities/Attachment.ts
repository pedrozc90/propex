import { Property, Required, Allow } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { Publication } from "./Publication";
import { Project } from "./Project";

@Entity({ name: "attachments" })
export class Attachment extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Allow([ null, undefined ])
    @Required()
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 255 })
    public url: string;

    // @Required()
    // @Enum(AttachmentType)
    // @Default(AttachmentType.DOCUMENT)
    // @Property({ name: "type" })
    // // @Column({ name: "type", type: "enum", enum: AttachmentTypeEnum, nullable: false })
    // @Column({ name: "type", type: "varchar", length: 255, transformer: AttachmentTypeEnumTransformer, default: "DOCUMENT", nullable: false })
    // public type: AttachmentType = AttachmentType.DOCUMENT;

    @Required()
    @Property({ name: "contentType" })
    @Column({ name: "content_type", type: "varchar", length: 255, nullable: false })
    public contentType: string;

    @Property({ name: "fileSize" })
    @Column({ name: "file_size", type: "double", precision: 8, scale: 2, nullable: false })
    public fileSize: number;

    @Required()
    @Property({ name: "fileName" })
    @Column({ name: "file_name", type: "varchar", length: 255, nullable: false })
    public fileName: string;

    @Property({ name: "fileNameNormalized" })
    @Column({ name: "file_name_normalized", type: "varchar", length: 255, nullable: false })
    public fileNameNormalized: string;

    @Property({ name: "content" })
    @Column({ name: "content", type: "longblob" })
    public content: Promise<Buffer>;

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
