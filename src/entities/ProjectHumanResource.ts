import { Property, Required, Format, Default } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, Column, ManyToOne, JoinColumn, Unique, PrimaryColumn, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";
import { User } from "./User";
import moment from "moment";

@Index("idx_project_human_resources_user_id", [ "user" ])
@Index("idx_project_human_resources_project_id", [ "project" ])
@Unique("uk_project_human_resources_user_projects", [ "user", "project" ])
@Entity({ name: "project_human_resources" })
export class ProjectHumanResource extends Audit {

    @PrimaryColumn({ name: "project_id", type: "bigint", unsigned: true, nullable: false })
    public projectId: number;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.projectHumanResources, { primary: true })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @PrimaryColumn({ name: "user_id", type: "bigint", unsigned: true, nullable: false })
    public userId: number;

    @Property({ name: "user" })
    @ManyToOne(() => User, (user) => user.projectHumanResources, { primary: true })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user: User;
    
    @Required()
    @Description("Marca o coordenador do projecto")
    @Default(false)
    @Property({ name: "coordinate" })
    @Column({ name: "coordinate", type: "boolean", default: false, nullable: false })
    public coordinate: boolean = false;

    @Required()
    @Description("Dedicação exclusiva")
    @Default(false)
    @Property({ name: "exclusive" })
    @Column({ name: "exclusive", type: "boolean", default: false, nullable: false })
    public exclusive: boolean = false;

    @Required()
    @Description("Carga horária")
    @Property({ name: "workload" })
    @Column({ name: "workload", type: "int", width: 11, nullable: false })
    public workload: number;

    @Format("date")
    @Description("Data de Admissão")
    @Default(Date.now)
    @Property({ name: "dateAdmission" })
    @Column({ name: "dt_admission", type: "date", nullable: false })
    public dateAdmission: string = moment().format("YYYY-MM-DD").toString();

}
