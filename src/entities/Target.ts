import { Property, Required, PropertyDeserialize } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index, Unique } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { AgeRange } from "../types";
import { AgeRangeEnumTransformer } from "../utils";

@Unique("uk_targets_age_range_project", [ "project", "ageRange" ])
@Index("idx_targets_project_id", [ "project" ])
@Entity({ name: "targets" })
export class Target extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Required()
    @Property({ name: "menNumber" })
    @Column({ name: "men_number", type: "int", width: 11, default: 0, nullable: true })
    public menNumber: number = 0;

    @Required()
    @Property({ name: "womenNumber" })
    @Column({ name: "women_number", type: "int", width: 11, default: 0, nullable: true })
    public womenNumber: number = 0;
    
    // @PropertySerialize((v) => AgeRangeEnumTransformer.to(v))
    @PropertyDeserialize((v) => AgeRangeEnumTransformer.from(v.key || v))
    @Property({ name: "ageRange" })
    @Column({ name: "age_range", type: "varchar", length: 255, transformer: AgeRangeEnumTransformer, nullable: false })
    public ageRange: AgeRange;

    // @Required()
    // @Enum(AgeRange)
    // @Property({ name: "ageRange" })
    // @Column({ name: "age_range", type: "enum", enum: AgeRange, default: AgeRange.UNTIL_12, nullable: false })
    // public ageRange: AgeRange;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.targets, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
