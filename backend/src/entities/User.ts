import { Default, Enum, Format, Property, Required, IgnoreProperty } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn, Index, ManyToMany, JoinTable, OneToOne, Unique } from "typeorm";

import { Permission } from "./Permission";
import { Role } from "../types";
import { Collaborator } from "./Collaborator";
import { Student } from "./Student";

export class UserCredentials {

    @Description("User email")
    @Example("yourname@domain.com")
    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", length: 255, nullable: false, unique: true })
    public email: string;

    @Description("User password")
    @Example("abcdef")
    @Required()
    @Property({ name: "password" })
    @Column({ name: "password", type: "varchar", length: 255, nullable: false })
    public password: string;
    
}

export class UserBasic extends UserCredentials {

    @Description("User name")
    @Example("yourname")
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;
    
}

@Entity({ name: "users" })
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;

    @IgnoreProperty()
    password!: string;

    @Description("User phone")
    @Example("(48) 3433-0000")
    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 255, nullable: false })
    public phone: string;

    @Description("Flag active user")
    @Property({ name: "active" })
    @Column({ name: "active", type: "boolean", nullable: false, default: true })
    public active!: boolean;

    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    public createdAt!: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @CreateDateColumn({ name: "updated_at", type: "timestamp" })
    public updatedAt!: Date;

    @ManyToMany(() => Permission, (permission) => permission.users)
    @JoinTable({
        name: "users_permissions",
        joinColumn: { name: "permission_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
    })
    public permissions: Permission[];

    @OneToOne(() => Collaborator, (collaborator) => collaborator.user, { nullable: false })
    public collaborator: Collaborator;

    @OneToOne(() => Student, (student) => student.user)
    public student: Student;
    
}
