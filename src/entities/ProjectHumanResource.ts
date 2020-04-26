import { Property, Required, Format, Default } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from "typeorm";

import { Audit } from "./generics/Audit";
import { Collaborator } from "./Collaborator";
import { Project } from "./Project";
import { Student } from "./Student";

@Index("idx_collaborator_id", [ "collaborator" ])
@Index("idx_student_id", [ "student" ])
@Index("idx_project_id", [ "project" ])
@Entity({ name: "project_human_resources" })
export class ProjectHumanResource extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id: number;

    @Required()
    @Description("Marca o coordenador do projecto")
    @Property({ name: "coordinate" })
    @Column({ name: "coordinate", type: "boolean", default: false, nullable: false })
    public coordinate: boolean;

    @Required()
    @Description("Carga horária")
    @Property({ name: "workload" })
    @Column({ name: "workload", type: "int", width: 11, nullable: false })
    public workload: number;

    @Required()
    @Description("Dedicação exclusiva")
    @Property({ name: "exclusive" })
    @Column({ name: "exclusive", type: "boolean", default: false, nullable: false })
    public exclusive: boolean;

    @Format("date")
    @Description("Data de Admissão")
    @Default(Date.now)
    @Property({ name: "dateAdmission" })
    @Column({ name: "dt_admission", type: "date", nullable: false })
    public dateAdmission: string;

    @Property({ name: "project" })
    @ManyToOne(() => Project, (project) => project.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

    @Property({ name: "collaborator" })
    @ManyToOne(() => Collaborator, (collaborator) => collaborator.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "collaborator_id", referencedColumnName: "id" })
    public collaborator: Collaborator;

    @Property({ name: "student" })
    @ManyToOne(() => Student, (student) => student.projectHumanResources, { nullable: false })
    @JoinColumn({ name: "student_id", referencedColumnName: "id" })
    public student: Student;

}
