import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { User } from "./User";

@Entity({ name: "students" })
@Index("idx_user_id", [ "user" ])
export class Student extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
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
    @Column({ name: "period", type: "int", width: 11, nullable: false })
    public period: string;

    @Required()
    @Property({ name: "hasScholarship" })
    @Column({ name: "has_scholarship", type: "boolean", default: false, nullable: false })
    public hasScholarship: boolean;

    @OneToOne(() => User, (user) => user.student, { nullable: true })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;

}
