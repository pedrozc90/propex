import { Property, Required } from "@tsed/common";
import { Description } from "@tsed/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";

import { Audit } from "./generics/Audit";
import { Activity } from "./Activity";
import { Attachment } from "./Attachment";
import { Demand } from "./Demand";
import { DisclosureMedia } from "./DisclosureMedia";
import { Evaluation } from "./Evaluation";
import { Event } from "./Event";
import { ExtensionLine } from "./ExtensionLine";
import { FutureDevelopmentPlan } from "./FutureDevelopmentPlan";
import { KnowledgeArea } from "./KnowledgeArea";
import { Partner } from "./Partner";
import { ProjectHumanResource } from "./ProjectHumanResource";
import { ProjectPublic } from "./ProjectPublic";
import { Target } from "./Target";
import { ProjectThemeArea } from "./ProjectThemeArea";
import { Publication } from "./Publication";

export class ProjectBasic {
    
    @Required()
    @Description("Título do Projeto")
    @Property({ name: "title" })
    public title: string;

    @Required()
    @Description("Nome do programa institucional vinculado ao pejeto")
    @Property({ name: "program" })
    public program: string;

}

@Entity({ name: "projects" })
export class Project extends Audit {

    @Property({ name: "id" })
    @PrimaryGeneratedColumn({ name: "id", type: "bigint", unsigned: true })
    public id!: number;
    
    // @Required()
    @Description("Título do Projeto")
    @Property({ name: "title" })
    @Column({ name: "title", type: "varchar", length: 255, nullable: false })
    public title: string;

    // @Required()
    @Description("Nome do programa institucional vinculado ao pejeto")
    @Property({ name: "program" })
    @Column({ name: "program", type: "varchar", length: 255, nullable: false })
    public program: string;

    // @Required()
    @Description("")
    @Property({ name: "startSeason" })
    @Column({ name: "start_season", type: "varchar", length: 15, nullable: true })
    public startSeason: string;

    // @Required()
    @Description("Cursos envolvidos")
    @Property({ name: "includedCourses" })
    @Column({ name: "included_courses", type: "longtext", nullable: true })
    public includedCourses: string;

    // @Required()
    @Description("PPC e Calendário do(s) curso(s)")
    @Property({ name: "ppcAndCourseCalendar" })
    @Column({ name: "ppc_and_course_calendar", type: "longtext", nullable: true })
    public ppcAndCourseCalendar: string;

    // @Required()
    @Description("Créditos previstos na matriz curricular")
    @Property({ name: "requiredCoursesCredits" })
    @Column({ name: "required_courses_credits", type: "longtext", nullable: true })
    public requiredCoursesCredits: string;

    // @Required()
    @Description("Espaço físico e equipamentos utilizados para o desencolvimento das atividades")
    @Property({ name: "infrastructure" })
    @Column({ name: "infrastructure", type: "longtext", nullable: true })
    public infrastructure: string;

    // @Required()
    @Description("Forma na qual o público participou das atividades")
    @Property({ name: "publicParticipation" })
    @Column({ name: "public_participation", type: "longtext", nullable: true })
    public publicParticipation: string;

    // @Required()
    @Description("Acompanhamento e avalização pelo coordenador do projeto")
    @Property({ name: "accompanimentAndEvaluation" })
    @Column({ name: "accompaniment_and_evaluation", type: "longtext", nullable: true })
    public accompanimentAndEvaluation: string;

    @Property({ name: "disclosureMedias" })
    @OneToMany(() => DisclosureMedia, (disclosureMedia) => disclosureMedia.project)
    public disclosureMedias: DisclosureMedia[];

    @Property({ name: "events" })
    @OneToMany(() => Event, (event) => event.project)
    public events: Event[];

    @Property({ name: "evaluations" })
    @OneToMany(() => Evaluation, (evaluation) => evaluation.project)
    public evaluations: Evaluation[];

    @Property({ name: "futureDevelopmentPlans" })
    @OneToMany(() => FutureDevelopmentPlan, (futureDevelopmentPlan) => futureDevelopmentPlan.project)
    public futureDevelopmentPlans: FutureDevelopmentPlan[];

    @Property({ name: "partners" })
    @OneToMany(() => Partner, (partner) => partner.project)
    public partners: Partner[];

    @Property({ name: "demands" })
    @OneToMany(() => Demand, (demand) => demand.project)
    public demands: Demand[];

    @Property({ name: "publications" })
    @OneToMany(() => Publication, (publication) => publication.project)
    public publications: Publication[];

    @Property({ name: "projectHumanResources" })
    @OneToMany(() => ProjectHumanResource, (projectHumanResource) => projectHumanResource.project)
    public projectHumanResources: ProjectHumanResource[];

    @Property({ name: "projectPublics" })
    @OneToMany(() => ProjectPublic, (projectPublic) => projectPublic.project)
    public projectPublics: ProjectPublic[];

    @Property({ name: "targets" })
    @OneToMany(() => Target, (target) => target.project)
    public targets: Target[];

    @Property({ name: "projectThemeAreas" })
    @OneToMany(() => ProjectThemeArea, (projectThemeArea) => projectThemeArea.project)
    public projectThemeAreas: ProjectThemeArea[];

    @Property({ name: "activities" })
    @OneToMany(() => Activity, (activity) => activity.project)
    public activities: Activity[];

    @Property({ name: "extensionLines" })
    @ManyToMany(() => ExtensionLine, (extensionLine) => extensionLine.projects, { cascade: false })
    @JoinTable({
        name: "project_extension_lines",
        joinColumn: { name: "project_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "extension_line_id", referencedColumnName: "id" }
    })
    public extensionLines: ExtensionLine[];

    @Property({ name: "knowledgeAreas" })
    @ManyToMany(() => KnowledgeArea, (knowledgeArea) => knowledgeArea.projects, { cascade: false })
    @JoinTable({
        name: "project_knowledge_areas",
        joinColumn: { name: "project_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "knowledge_area_id", referencedColumnName: "id" }
    })
    public knowledgeAreas: KnowledgeArea[];

    @Property({ name: "attachments" })
    @ManyToMany(() => Attachment, (attachment) => attachment.projects)
    @JoinTable({
        name: "project_attachments",
        joinColumn: { name: "project_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "attachment_id", referencedColumnName: "id" }
    })
    public attachments: Attachment[];

}
