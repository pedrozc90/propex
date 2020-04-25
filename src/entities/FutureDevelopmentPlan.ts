import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from "typeorm";

import { Audit } from "./generics/Audit";
import { Project } from "./Project";

@Entity({ name: "future_development_plans" })
@Index("idx_project_id", [ "project" ])
export class FutureDevelopmentPlan extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Description("Atividades a serem desenvolvidas")
    @Property({ name: "activities" })
    @Column({ name: "activities", type: "longtext", nullable: false })
    public activities: string;

    @Required()
    @Description("Resultados esperados")
    @Property({ name: "expectedResults" })
    @Column({ name: "expected_results", type: "longtext", nullable: false })
    public expectedResults: string;

    @Required()
    @Description("Previsão do número de participantes do projeto")
    @Property({ name: "participantsNumber" })
    @Column({ name: "participants_number", type: "varchar", length: 255, nullable: false })
    public participantsNumber: string;

    @ManyToOne(() => Project, (project) => project.futureDevelopmentPlans)
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
