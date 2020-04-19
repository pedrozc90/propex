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
    @Property({ name: "description" })
    @Column({ name: "description", type: "varchar", length: 255, nullable: false })
    public description: string;

    @OneToMany(() => ProjectThemeArea, (projectThemeArea) => projectThemeArea.themeArea)
    public projectThemeAreas: ProjectThemeArea[];

}
