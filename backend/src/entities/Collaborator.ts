import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";

import { Audit } from "./generics/Audit";
import { User } from "./User";

@Entity({ name: "collaborators" })
export class Collaborator extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "academicFunction" })
    @Column({ name: "academic_function", type: "varchar", length: 255, nullable: false })
    public academicFunction: string;

    @Required()
    @Property({ name: "profissionalRegistry" })
    @Column({ name: "profissional_registry", type: "varchar", length: 255, nullable: false })
    public profissionalRegistry: string;

    @Required()
    @Property({ name: "linkFormat" })
    @Column({ name: "link_format", type: "varchar", length: 255, nullable: false })
    public linkFormat: string;

    @OneToOne(() => User, (user) => user.collaborator, { nullable: false })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;

}
