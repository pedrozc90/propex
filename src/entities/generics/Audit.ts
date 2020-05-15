import { Default, Format, Property } from "@tsed/common";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class Audit {
    
    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: true })
    public createdAt: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
    public updatedAt: Date;

    // @Property({ name: "version" })
    // @VersionColumn({ name: "version", type: "int", default: 0 })
    // public version!: number;
    
}
