import { Property, Required, Format } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "disclosure_medias" })
export class DisclosureMedia extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "mediaName" })
    @Column({ name: "media_name", type: "varchar", length: 255, nullable: false })
    public mediaName: string;

    @Required()
    @Format("date")
    @Property({ name: "date" })
    @Column({ name: "date", type: "date", nullable: false })
    public date: string;

    @Required()
    @Property({ name: "link" })
    @Column({ name: "link", type: "varchar", length: 255, nullable: false })
    public link: string;

    @OneToOne(() => Project, (project) => project.disclosureMedia, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
