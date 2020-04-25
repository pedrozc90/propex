import { Default, Format, Property, Required, IgnoreProperty, Enum } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany, Unique, OneToOne } from "typeorm";

import { Permission } from "./Permission";
import { Collaborator } from "./Collaborator";
import { Student } from "./Student";
import { ProjectHumanResource } from "./ProjectHumanResource";
import { UserRole } from "../types";
import { UserRoleEnumTransformer } from "../utils";

export class UserCredentials {

    @Description("User email")
    @Example("yourname@domain.com")
    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", length: 255, nullable: false })
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
@Unique("uk_user_email", [ "email" ])
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @IgnoreProperty()
    password: string;

    @Description("User phone")
    @Example("(48) 3433-0000")
    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 255, nullable: false })
    public phone: string;

    @Required()
    @Enum(UserRole)
    @Property({ name: "role" })
    @Column({ name: "role", type: "varchar", transformer: UserRoleEnumTransformer, nullable: false })
    public role: UserRole = UserRole.STUDENT;

    @Description("Mark if user is active")
    @Property({ name: "active" })
    @Column({ name: "active", type: "boolean", nullable: false, default: true })
    public active: boolean = true;

    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: false, update: false })
    public createdAt: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @CreateDateColumn({ name: "updated_at", type: "timestamp", nullable: true, update: true })
    public updatedAt: Date;

    @ManyToMany(() => Permission, (permission) => permission.users)
    @JoinTable({
        name: "users_permissions",
        joinColumn: { name: "permission_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
    })
    public permissions: Permission[];

    @OneToMany(() => Collaborator, (collaborator) => collaborator.user, { nullable: false })
    public collaborators: Collaborator[];

    @OneToOne(() => Student, (student) => student.user)
    public student: Student;

    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.user)
    public projectHumanResources: ProjectHumanResource[];
    
}
