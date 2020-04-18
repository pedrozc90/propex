import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { Publication } from "./Publication";
import { ProjectAttachment } from "./ProjectAttachment";

@Entity({ name: "attachments" })
export class Attachment extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "type" })
    @Column({ name: "type", type: "varchar", length: 255, nullable: false })
    public type: string;

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

    @ManyToMany(() => Activity, (activity) => activity.attachments)
    public activities: Activity[];

    @OneToMany(() => Publication, (publication) => publication.attachment)
    public publications: Publication[];

    @OneToMany(() => ProjectAttachment, (projectAttachment) => projectAttachment.attachment)
    public projectAttachments: ProjectAttachment[];

}
