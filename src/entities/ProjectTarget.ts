import { Property, Required, Enum } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { AgeRange } from "../types";
import { AgeRangeEnumTransformer } from "../utils";

@Index("idx_project_id", [ "project" ])
@Entity({ name: "project_targets" })
export class ProjectTarget extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;

    @Required()
    @Property({ name: "menNumber" })
    @Column({ name: "men_number", type: "int", width: 11, default: null, nullable: true })
    public menNumber: number | null;

    @Required()
    @Property({ name: "womenNumber" })
    @Column({ name: "women_number", type: "int", width: 11, default: null, nullable: true })
    public womenNumber: number | null;

    @Required()
    @Enum(AgeRange)
    @Property({ name: "ageRange" })
    // @Column({ name: "age_range", type: "enum", enum: AgeRange, default: AgeRange.UNTIL_12, nullable: false })
    @Column({ name: "age_range", transformer: AgeRangeEnumTransformer, nullable: false })
    public ageRange: AgeRange;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.projectTargets, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
