import { Property, Required, Allow, IgnoreProperty } from "@tsed/common";
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
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 255, nullable: true })
    public url?: string;

    @Property({ name: "contentType" })
    @Column({ name: "content_type", type: "varchar", length: 255, nullable: true })
    public contentType?: string;

    @Property({ name: "fileSize" })
    @Column({ name: "file_size", type: "double", precision: 8, scale: 2, nullable: true })
    public fileSize?: number;

    @Property({ name: "fileName" })
    @Column({ name: "file_name", type: "varchar", length: 255, nullable: true })
    public fileName?: string;

    @Property({ name: "fileNameNormalized" })
    @Column({ name: "file_name_normalized", type: "varchar", length: 255, nullable: true })
    public fileNameNormalized?: string;

    @Property({ name: "extension" })
    @Column({ name: "extension", type: "varchar", length: 8, nullable: true })
    public extension?: string;

    @IgnoreProperty()
    @Property({ name: "content" })
    @Column({ name: "content", type: "longblob", nullable: true })
    public content?: Buffer;

    @Property({ name: "publications" })
    @OneToMany(() => Publication, (publication) => publication.attachment)
    public publications?: Publication[];

    @Property({ name: "activities" })
    @ManyToMany(() => Activity, (activity) => activity.attachments)
    public activities?: Activity[];

    @Property({ name: "projects" })
    @ManyToMany(() => Project, (project) => project.activities)
    public projects?: Project[];

}
