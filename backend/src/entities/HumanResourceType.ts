import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { ProjectHumanResource } from "./ProjectHumanResource";

@Entity({ name: "human_resource_types" })
export class HumanResourceType extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "longtext", nullable: false })
    public description: string;

    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.humanResourceType)
    public projectHumanResources: ProjectHumanResource[];

}
