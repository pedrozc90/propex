import { Property, Required } from "@tsed/common";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from ".";
import { ThemeArea } from "./ThemeArea";

@Entity({ name: "project_theme_areas" })
export class ProjectThemeArea extends Audit {

    @Required()
    @Property({ name: "main" })
    @Column({ name: "main", type: "boolean", nullable: false })
    public main: boolean;

    @ManyToOne(() => Project, (project) => project.projectThemeAreas, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    @PrimaryColumn()
    public project: Project;

    @ManyToOne(() => ThemeArea, (themeArea) => themeArea.projectThemeAreas, { nullable: false })
    @JoinColumn({ name: "theme_area_id", referencedColumnName: "id" })
    @PrimaryColumn()
    public themeArea: ThemeArea;

}
