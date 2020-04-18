import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { Audit } from "./generics/Audit";

@Entity({ name: "human_resource_types" })
export class HumanResourceType extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "description" })
    @Column({ name: "description", type: "longtext", nullable: false })
    public description: string;

}
