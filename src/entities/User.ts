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

@Entity({ name: "users" })
@Unique("uk_user_email", [ "email" ])
export class User extends UserBasic {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @IgnoreProperty()
    public password: string;

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
    @CreateDateColumn({ name: "updated_at", type: "timestamp", nullable: true, update: true })
    public updatedAt: Date;

    @IgnoreProperty()
    @Property({ name: "collaborator" })
    @OneToOne(() => Collaborator, (collaborator) => collaborator.user)
    public collaborator: Collaborator;

    @IgnoreProperty()
    @Property({ name: "student" })
    @OneToOne(() => Student, (student) => student.user)
    public student: Student;
    
}
