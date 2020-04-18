import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { DisclosureMedia } from "./DisclosureMedia";
import { EventPresentation } from "./EventPresentation";
import { FinishedProject } from "./FinishedProject";
import { ProjectThemeArea } from "./ProjectThemeArea";

@Entity({ name: "projects" })
export class Project extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    @Required()
    @Property({ name: "name" })
    @Column({ name: "name", type: "varchar", length: 255, nullable: false })
    public name: string;

    @Required()
    @Property({ name: "institutionalLinkName" })
    @Column({ name: "institutional_link_name", type: "varchar", length: 255, nullable: false })
    public institutionalLinkName: string;

    @Required()
    @Property({ name: "startSeason" })
    @Column({ name: "start_season", type: "varchar", length: 15, nullable: false })
    public startSeason: string;

    @Required()
    @Property({ name: "involvedClasses" })
    @Column({ name: "involved_classes", type: "longtext", nullable: false })
    public involvedClasses: string;

    @Required()
    @Property({ name: "pccCalendarClassesArticulation" })
    @Column({ name: "pcc_calendar_classes_articulation", type: "longtext", nullable: false })
    public pccCalendarClassesArticulation: string;

    @Required()
    @Property({ name: "previewCreditsClasses" })
    @Column({ name: "preview_credits_classes", type: "longtext", nullable: false })
    public previewCreditsClasses: string;

    @Required()
    @Property({ name: "infrastructure" })
    @Column({ name: "infrastructure", type: "longtext", nullable: false })
    public infrastructure: string;

    @Required()
    @Property({ name: "publicParticipation" })
    @Column({ name: "publicParticipation", type: "longtext", nullable: false })
    public publicParticipation: string;

    @Required()
    @Property({ name: "accompanimentAndEvaluation" })
    @Column({ name: "accompaniment_and_evaluation", type: "longtext", nullable: false })
    public accompanimentAndEvaluation: string;

    @OneToMany(() => Activity, (activity) => activity.project)
    public activities: Activity[];

    @OneToOne(() => DisclosureMedia, (disclosureMedia) => disclosureMedia.project)
    public disclosureMedia: DisclosureMedia;

    @OneToOne(() => EventPresentation, (eventPresentation) => eventPresentation.project, { nullable: false })
    public eventPresentation: EventPresentation;

    @OneToOne(() => FinishedProject, (finishedProject) => finishedProject.project)
    public finishedProject: FinishedProject;

    @OneToMany(() => ProjectThemeArea, (projectThemeArea) => projectThemeArea.project)
    public projectThemeAreas: ProjectThemeArea[];

}
