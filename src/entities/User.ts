import { Default, Format, Property, Required, IgnoreProperty, Allow, PropertyDeserialize } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne, UpdateDateColumn, OneToMany } from "typeorm";

import { Collaborator } from "./Collaborator";
import { Student } from "./Student";
import { ProjectHumanResource } from "./ProjectHumanResource";
import { ScopeEnumTransformer } from "../core/utils";
import { Scope } from "../core/types";

export class UserCredentials {

    @Description("User email")
    @Example("yourname@domain.com")
    @Format("email")
    @Required()
    @Property({ name: "email" })
    @Column({ name: "email", type: "varchar", length: 128, nullable: false })
    public email: string;

    @Description("User password")
    @Example("abcdef")
    @Required()
    @Property({ name: "password" })
    @Column({ name: "password", type: "varchar", length: 32, nullable: false })
    public password: string;
    
}

export class UserBasic extends UserCredentials {

    @Allow([ null, undefined ])
    public password: string;

    @Description("User name")
    @Example("yourname")
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 128, nullable: false })
    public name: string;

    @Description("User phone")
    @Example("(48) 99999-9999")
    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 20, nullable: false })
    public phone: string;
    
}

@Unique("uk_users_email", [ "email" ])
@Entity({ name: "users" })
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Allow([ null, undefined ])
    public name: string;

    @IgnoreProperty()
    public password: string;

    @Allow([ null, undefined ])
    public phone: string;

    @IgnoreProperty()
    @Description("Mark if user is active")
    @Property({ name: "active" })
    @Column({ name: "active", type: "boolean", nullable: false, default: true })
    public active: boolean = true;

    // @PropertySerialize((v) => AgeRangeEnumTransformer.to(v))
    @PropertyDeserialize((v) => ScopeEnumTransformer.from(v.key || v))
    @Property({ name: "role" })
    @Column({ name: "role", type: "varchar", length: 255, transformer: ScopeEnumTransformer, nullable: false })
    public role: Scope = Scope.UNKNOWN;

    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: false, update: false })
    public createdAt: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true, update: true })
    public updatedAt: Date;

    @Property({ name: "collaborator" })
    @OneToOne(() => Collaborator, (collaborator) => collaborator.user)
    public collaborator: Collaborator;

    @Property({ name: "student" })
    @OneToOne(() => Student, (student) => student.user)
    public student: Student;

    @Property({ name: "projectHumanResources" })
    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.user)
    public projectHumanResources: ProjectHumanResource[];
    
}
