import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import { Audit } from "./generics/Audit";
import { User } from "./User";

@Entity({ name: "permissions" })
export class Permission extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "url" })
    @Column({ name: "url", type: "varchar", length: 180, nullable: true })
    public url: string;

    @ManyToMany(() => User, (user) => user.permissions)
    public users: User[];

}
