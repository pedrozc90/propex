import { Property, Required } from "@tsed/common";
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
    @Property({ name: "activities" })
    @Column({ name: "activities", type: "longtext", nullable: false })
    public activities: string;

    @Required()
    @Property({ name: "expectedResults" })
    @Column({ name: "expected_results", type: "longtext", nullable: false })
    public expectedResults: string;

    @Required()
    @Property({ name: "participantsNumberForecast" })
    @Column({ name: "participants_number_forecast", type: "varchar", length: 255, nullable: false })
    public participantsNumberForecast: string;

    @ManyToOne(() => Project, (project) => project.futureDevelopmentPlans)
    @JoinColumn({ name: "project_id", referencedColumnName: "id" })
    public project: Project;

}
