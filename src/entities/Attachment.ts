import { Property, IgnoreProperty } from "@tsed/common";
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
    
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 255, nullable: true })
    public url?: string;

    @Property({ name: "contentType" })
    @Column({ name: "content_type", type: "varchar", length: 255, nullable: true })
    public contentType?: string;

    @Property({ name: "size" })
    @Column({ name: "size", type: "double", precision: 8, scale: 2, nullable: true })
    public size?: number;

    @Property({ name: "filename" })
    @Column({ name: "filename", type: "varchar", length: 255, nullable: true })
    public filename?: string;

    @Property({ name: "filenameNormalized" })
    @Column({ name: "filename_normalized", type: "varchar", length: 255, nullable: true })
    public filenameNormalized?: string;

    @Property({ name: "extension" })
    @Column({ name: "extension", type: "varchar", length: 8, nullable: true })
    public extension?: string;

    @IgnoreProperty()
    @Property({ name: "content" })
    @Column({ name: "content", type: "longblob", nullable: true })
    public content?: Buffer;

    @IgnoreProperty()
    @Property({ name: "publications" })
    @OneToMany(() => Publication, (publication) => publication.attachment, { cascade: false, persistence: false })
    public publications: Publication[];

    @IgnoreProperty()
    @Property({ name: "activities" })
    @ManyToMany(() => Activity, (activity) => activity.attachments, { cascade: false, persistence: false })
    public activities: Activity[];

    @IgnoreProperty()
    @Property({ name: "projects" })
    @ManyToMany(() => Project, (project) => project.attachments, { cascade: false, persistence: false })
    public projects: Project[];

}
