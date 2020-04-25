import { Default, Format, Property, Required, IgnoreProperty } from "@tsed/common";
import { Description, Example } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToOne } from "typeorm";

import { Collaborator } from "./Collaborator";
import { Student } from "./Student";

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
    @Example("(48) 99999-9999")
    @Required()
    @Property({ name: "phone" })
    @Column({ name: "phone", type: "varchar", length: 255, nullable: false })
    public phone: string;

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

    @OneToOne(() => Collaborator, (collaborator) => collaborator.user)
    public collaborator: Collaborator;

    @OneToOne(() => Student, (student) => student.user)
    public student: Student;
    
}
