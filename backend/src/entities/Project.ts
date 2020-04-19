import { Property, Required } from "@tsed/common";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";

import { Audit } from "./generics/Audit";
import { DisclosureMedia } from "./DisclosureMedia";
import { EventPresentation } from "./EventPresentation";
import { Evaluation } from "./Evaluation";
import { FutureDevelopmentPlan } from "./FutureDevelopmentPlan";
import { Partner } from "./Partner";
import { Demand } from "./Demand";
import { Publication } from "./Publication";
import { ProjectAttachment } from "./ProjectAttachment";
import { ExtensionLine } from "./ExtensionLine";
import { ProjectHumanResource } from "./ProjectHumanResource";
import { KnowledgeArea } from "./KnowledgeArea";
import { ProjectPublic } from "./ProjectPublic";
import { ProjectTarget } from "./ProjectTarget";
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

    @OneToMany(() => DisclosureMedia, (disclosureMedia) => disclosureMedia.project)
    public disclosureMedias: DisclosureMedia[];

    @OneToMany(() => EventPresentation, (eventPresentation) => eventPresentation.project)
    public eventPresentations: EventPresentation[];

    @OneToMany(() => Evaluation, (evaluation) => evaluation.project)
    public evaluations: Evaluation[];

    @OneToMany(() => FutureDevelopmentPlan, (futureDevelopmentPlan) => futureDevelopmentPlan.project)
    public futureDevelopmentPlans: FutureDevelopmentPlan[];

    @OneToMany(() => Partner, (partner) => partner.project)
    public partners: Partner[];

    @OneToMany(() => Demand, (demand) => demand.project)
    public demands: Demand[];

    @OneToMany(() => Publication, (publication) => publication.project)
    public publications: Publication[];

    @OneToMany(() => ProjectAttachment, (projectAttachment) => projectAttachment.project)
    public projectAttachments: ProjectAttachment[];

    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.project)
    public projectHumanResources: ProjectHumanResource[];

    @OneToMany(() => ProjectPublic, (projectPublic) => projectPublic.project)
    public projectPublics: ProjectPublic[];

    @OneToMany(() => ProjectTarget, (projectTarget) => projectTarget.project)
    public projectTargets: ProjectTarget[];

    @OneToMany(() => ProjectThemeArea, (projectThemeArea) => projectThemeArea.project)
    public projectThemeAreas: ProjectThemeArea[];

    @ManyToMany(() => ExtensionLine, (extensionLine) => extensionLine.projects)
    @JoinTable({
        name: "project_extension_lines",
        joinColumn: { name: "extension_line_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "project_id", referencedColumnName: "id" }
    })
    public extensionLines: ExtensionLine[];

    @ManyToMany(() => KnowledgeArea, (knowledgeArea) => knowledgeArea.projects)
    @JoinTable({
        name: "project_knowledge_areas",
        joinColumn: { name: "knowledge_area_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "project_id", referencedColumnName: "id" }
    })
    public knowledgeAreas: KnowledgeArea[];

    // NÃO SEI PORQUE NAO HÁ ESTE RELACIONAMENTO
    // @OneToMany(() => Activity, (activity) => activity.project)
    // public activities: Activity[];

}
