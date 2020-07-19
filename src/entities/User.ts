import { Default, Format, Property, Required, IgnoreProperty, Allow, PropertyDeserialize, PropertySerialize } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, UpdateDateColumn, OneToMany } from "typeorm";

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

@Unique("uk_users_code", [ "code" ])
@Unique("uk_users_email", [ "email" ])
@Entity({ name: "users" })
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Allow([ null, undefined ])
    public name: string;

    @PropertySerialize(() => undefined)
    @PropertyDeserialize((v) => v)
    public password: string;

    @Allow([ null, undefined ])
    public phone: string;

    @Description("Código de Matricula / Registro Profissional")
    @Property({ name: "code" })
    @Column({ name: "code", type: "varchar", length: 32, nullable: false })
    public code: string;

    @Allow([ null, undefined ])
    @PropertySerialize((v) => v)
    @PropertyDeserialize((v) => ScopeEnumTransformer.from((typeof v === "string") ? v : v.key))
    @Property({ name: "role" })
    @Column({ name: "role", type: "varchar", length: 255, transformer: ScopeEnumTransformer, nullable: false })
    public role: Scope;

    @IgnoreProperty()
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
    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true, update: true })
    public updatedAt: Date;

    // --------------------------------------------------
    // STUDENT
    // --------------------------------------------------
    @Property({ name: "course" })
    @Column({ name: "course", type: "varchar", length: 255, nullable: true })
    public course: string | null;

    @Property({ name: "period" })
    @Column({ name: "period", type: "varchar", length: 16, nullable: true })
    public period: string | null;

    @Default(false)
    @Property({ name: "scholarship" })
    @Column({ name: "scholarship", type: "boolean", default: false, nullable: false })
    public scholarship: boolean = false;

    // --------------------------------------------------
    // COLLABORATOR
    // --------------------------------------------------
    @Description("Formação Acadêmica / Função")
    @Property({ name: "academicFunction" })
    @Column({ name: "academic_function", type: "varchar", length: 255, nullable: true })
    public academicFunction: string | null;

    @Description("Forma de Vínculo (CLT, Prestação de Serviço, etc.)")
    @Property({ name: "affiliation" })
    @Column({ name: "affiliation", type: "varchar", length: 255, nullable: true })
    public affiliation: string | null;

    @Property({ name: "projectHumanResources" })
    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.user)
    public projectHumanResources: ProjectHumanResource[];
    
}
