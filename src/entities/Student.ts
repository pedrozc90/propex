import { Property, Required, Default } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index, Unique } from "typeorm";

import { Audit } from "./generics/Audit";
import { User } from "./User";

@Index("idx_students_user_id", [ "user" ])
@Unique("uk_students_code", [ "code" ])
@Entity({ name: "students" })
export class Student extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;
    
    @Required()
    @Property({ name: "code" })
    @Column({ name: "code", type: "varchar", length: 255, nullable: false })
    public code: string;

    @Required()
    @Property({ name: "course" })
    @Column({ name: "course", type: "varchar", length: 255, nullable: false })
    public course: string;

    @Required()
    @Property({ name: "period" })
    @Column({ name: "period", type: "varchar", length: 16, nullable: false })
    public period: string;

    @Required()
    @Default(false)
    @Property({ name: "scholarship" })
    @Column({ name: "scholarship", type: "boolean", default: false, nullable: false })
    public scholarship: boolean = false;

    @Property({ name: "user" })
    @OneToOne(() => User, (user) => user.student, { nullable: true })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;

}
