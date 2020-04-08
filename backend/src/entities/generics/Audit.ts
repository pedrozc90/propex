import { Default, Format, Property } from "@tsed/common";
import { CreateDateColumn, VersionColumn } from "typeorm";

export class Audit {
    
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
    
}
