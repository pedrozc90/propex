import { Default, Enum, Format, Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn } from "typeorm";
import { Role } from "../types/enums";

@Entity({ name: "users" })
export class User {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    public id!: number;

    @Required()
    // @MinLength(3)
    // @MaxLength(255)
    @Property({ name: "name" })
    @Column({ name: "name", nullable: true })
    public name!: string;

    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", nullable: true })
    public email!: string;

    @Required()
    // @MinLength(6)
    // @MaxLength(16)
    // @Pattern(/[a-z]/)
    @Property({ name: "password" })
    @Column({ name: "password", nullable: true })
    public password!: string;

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
    @VersionColumn({ name: "version", type: "int", default: 1 })
    public version!: number;

}
