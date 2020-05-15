import { Property, Required, Format } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { ProjectPublic } from "./ProjectPublic";

@Entity({ name: "publics" })
export class Public extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    // @Required()
    @Description("Centro de Referência de Assitência Social - CRAS")
    @Property({ name: "cras" })
    @Column({ name: "cras", type: "varchar", length: 255, nullable: true })
    public cras: string;

    @Format("date-time")
    @Property({ name: "deletedAt" })
    @Column({ name: "deleted_at", type: "timestamp", nullable: true })
    public deletedAt: Date;

    @Property({ name: "projectPublics" })
    @OneToMany(() => ProjectPublic, (projectPublic) => projectPublic.public)
    public projectPublics: ProjectPublic[];

}
