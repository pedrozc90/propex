import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { ProjectThemeArea } from "./ProjectThemeArea";

@Entity({ name: "theme_areas" })
export class ThemeArea extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Property({ name: "projectThemeAreas" })
    @OneToMany(() => ProjectThemeArea, (projectThemeArea) => projectThemeArea.themeArea)
    public projectThemeAreas: ProjectThemeArea[];

}
