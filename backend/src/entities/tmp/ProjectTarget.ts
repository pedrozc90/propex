// import { Property, Required, Default } from "@tsed/common";
// import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

// import { Audit } from "../generics/Audit";
// import { Project } from "./Project";
// import { ThemeArea } from "./ThemeArea";
// import { AgeRangeEnum } from "../../types";
// import { TransformerAgeRangeEnum } from "../../utils";

// @Entity({ name: "project_targets" })
// export class ProjectTarget extends Audit {

//     @Property({ name: "id" })
//     @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
//     public id!: number;

//     @Required()
//     @Property({ name: "menNumber" })
//     @Column({ name: "men_number", type: "int", nullable: false })
//     public menNumber: number;

//     @Required()
//     @Property({ name: "womenNumber" })
//     @Column({ name: "women_number", type: "int", nullable: false })
//     public womenNumber: number;

//     @Required()
//     @Property({ name: "ageRange" })
//     // @Column({ name: "age_range", type: "enum", enum: AgeRangeEnum, default: AgeRangeEnum.UNTIL_12, nullable: false })
//     @Column({ name: "age_range", transformer: TransformerAgeRangeEnum, nullable: false })
//     public ageRange: AgeRangeEnum;

//     @ManyToOne(() => Project, (project) => project.projectThemeAreas, { nullable: false })
//     @JoinColumn({ name: "project_id", referencedColumnName: "id" })
//     public project: Project;

// }
