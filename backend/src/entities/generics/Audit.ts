import { Default, Format, Property } from "@tsed/common";
import { CreateDateColumn } from "typeorm";

export class Audit {
    
    @Format("date-time")
    @Default(Date.now)
    @Property({ name: "createdAt" })
    @CreateDateColumn({ name: "created_at", type: "timestamp", nullable: false, update: false })
    public createdAt: Date;

    @Format("date-time")
    @Property({ name: "updatedAt" })
    @CreateDateColumn({ name: "updated_at", type: "timestamp", nullable: true, update: true })
    public updatedAt: Date;

    // @Property({ name: "version" })
    // @VersionColumn({ name: "version", type: "int", default: 0 })
    // public version!: number;
    
}
