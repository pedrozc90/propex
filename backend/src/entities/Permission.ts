import { Default, Format, Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, VersionColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity({ name: "permissions" })
export class Permission {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", nullable: true })
    public name: string;

    @Required()
    @Property({ name: "url" })
    @Column({ name: "url", nullable: true })
    public url: string;

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

    @ManyToMany(() => User, (user) => user.permissions)
    @JoinTable({
        name: "users_permissions",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
    })
    public users: User[];

}
