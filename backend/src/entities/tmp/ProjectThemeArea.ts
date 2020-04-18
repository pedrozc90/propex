// import { Property, Required } from "@tsed/common";
// import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

// import { Audit } from "../generics/Audit";
// import { Project } from "./Project";
// import { ThemeArea } from "./ThemeArea";

// @Entity({ name: "project_theme_areas" })
// export class ProjectThemeArea extends Audit {

//     @Required()
//     @Property({ name: "main" })
//     @Column({ name: "main", type: "boolean", nullable: false })
//     public main: boolean;

//     @ManyToOne(() => Project, (project) => project.projectThemeAreas, { nullable: false })
//     @JoinColumn({ name: "project_id", referencedColumnName: "id" })
//     @PrimaryColumn({ name: "project_id", type: "bigint", width: 20 })
//     public project: Project;

//     @ManyToOne(() => ThemeArea, (themeArea) => themeArea.projectThemeAreas, { nullable: false })
//     @JoinColumn({ name: "theme_area_id", referencedColumnName: "id" })
//     @PrimaryColumn({ name: "theme_area_id", type: "bigint", width: 20 })
//     public themeArea: ThemeArea;

// }
