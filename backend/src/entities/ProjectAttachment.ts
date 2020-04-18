import { Property, Required, Enum } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

import { AttachmentTypeEnum } from "../types";
import { Attachment } from "./Attachment";

@Index("idx_project_id", [ "project" ])
@Index("idx_attachment_id", [ "attachment" ])
@Entity({ name: "project_attachments" })
export class ProjectAttachment extends Audit {

    @Required()
    @Enum(AttachmentTypeEnum)
    @Property({ name: "type" })
    @Column({ name: "type", type: "enum", enum: AttachmentTypeEnum, nullable: false })
    public type: boolean;

    @ManyToOne(() => Project, (project) => project.projectAttachments, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    @PrimaryColumn({ name: "project_id", type: "bigint", width: 20, unsigned: true })
    public project: Project;

    @ManyToOne(() => Attachment, (attachment) => attachment.projectAttachments, { nullable: false })
    @JoinColumn({ name: "attachment_id", referencedColumnName: "id" })
    @PrimaryColumn({ name: "attachment_id", type: "bigint", width: 20, unsigned: true })
    public attachment: Attachment;

}
