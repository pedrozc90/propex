import { Property, Required, Enum, Format, Default } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

import { AttachmentTypeEnum } from "../types";
import { User } from "./User";
import { HumanResourceType } from "./HumanResourceType";

@Index("idx_project_id", [ "project" ])
@Index("idx_user_id", [ "user" ])
@Index("idx_human_resource_type_id", [ "humanResourceType" ])
@Entity({ name: "project_human_resources" })
export class ProjectHumanResource extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Enum(AttachmentTypeEnum)
    @Property({ name: "type" })
    @Column({ name: "type", type: "enum", enum: AttachmentTypeEnum, nullable: false })
    public type: boolean;

    @Required()
    @Property({ name: "coordinate" })
    @Column({ name: "coordinate", type: "boolean", default: false, nullable: false })
    public coordinate: boolean;

    @Required()
    @Property({ name: "workload" })
    @Column({ name: "workload", type: "int", width: 11, nullable: false })
    public workload: number;

    @Required()
    @Property({ name: "exclusive" })
    @Column({ name: "exclusive", type: "boolean", default: false, nullable: false })
    public exclusive: boolean;

    @Format("date")
    @Default(Date.now)
    @Property({ name: "initiatedAt" })
    @Column({ name: "initiated_at", type: "date", nullable: false })
    public initiatedAt: string;

    @ManyToOne(() => Project, (project) => project.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @ManyToOne(() => User, (user) => user.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;

    @ManyToOne(() => HumanResourceType, (humanResourceType) => humanResourceType.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "human_resource_type_id", referencedColumnName: "id" })
    public humanResourceType: HumanResourceType;

}
