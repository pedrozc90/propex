import { Default, Enum, Format, Property, Required, IgnoreProperty } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn, Index, ManyToMany } from "typeorm";

import { Permission } from "./Permission";
import { Role } from "../types/enums";

export class UserCredentials {

    @Description("User email")
    @Example("yourname@domain.com")
    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", nullable: true })
    public email: string;

    @Description("User password")
    @Example("abcdef")
    @Required()
    @Property({ name: "password" })
    @Column({ name: "password", nullable: true })
    public password: string;
    
}

export class UserBasic extends UserCredentials {

    @Description("User name")
    @Example("yourname")
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", nullable: true })
    public name: string;
    
}

@Entity({ name: "users" })
@Index("idx_unique_email", [ "email" ], { unique: true })
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    public id!: number;

    @IgnoreProperty()
    password!: string;

    @Description("User phone")
    @Example("(48) 3433-0000")
    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", nullable: true })
    public phone: string;

    @Required()
    @Enum(Role)
    @Default(Role.MEMBER)
    @Property({ name: "role" })
    @Column({ name: "role", type: "enum", enum: Role, default: Role.MEMBER, nullable: true })
    public role: Role = Role.MEMBER;

    @Property({ name: "isActive" })
    @Column({ name: "is_active", type: "boolean", default: true })
    public isActive!: boolean;

    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    public createdAt!: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @CreateDateColumn({ name: "updated_at", type: "timestamp" })
    public updatedAt!: Date;

    @Property({ name: "version" })
    @VersionColumn({ name: "version", type: "int", default: 0 })
    public version!: number;

    @ManyToMany(() => Permission, (permission) => permission.users)
    public permissions: Permission[];
    
}
