import { Controller, Locals, Get, Delete, Post, Put, QueryParams, PathParams, BodyParams, Required } from "@tsed/common";
import { HTTPException, Unauthorized, NotFound } from "ts-httpexceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Page, Project, ExtensionLine, ProjectHumanResource, DisclosureMedia, KnowledgeArea, ProjectPublic, Public, ThemeArea, ProjectTarget, ProjectThemeArea } from "../../entities";
import { IContext, Scope } from "../../types";

@Controller("/projects")
export class ProjectCtrl {

    constructor(
        private ActivityRepository: Repo.ActivityRepository,
        private AttachmentRepository: Repo.AttachmentRepository,
        private CollaboratorRepository: Repo.CollaboratorRepository,
        private DemandRepository: Repo.DemandRepository,
        private DisclosureMediaRepository: Repo.DisclosureMediaRepository,
        private EvaluationRepository: Repo.EvaluationRepository,
        private EventPresentationRepository: Repo.EventPresentationRepository,
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: Repo.FutureDevelopmentPlanRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private ProjectPublicRepository: Repo.ProjectPublicRepository,
        private ProjectTargetRepository: Repo.ProjectTargetRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private PublicRepository: Repo.PublicRepository,
        private PublicationRepository: Repo.PublicationRepository,
        private StudentRepository: Repo.StudentRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository,
        private UserRepository: Repo.UserRepository) {
        // initialize stuff here
    }

    @Get("/")
    @CustomAuth({ scope: [] })
    public async fetch(@Locals("context") context: IContext, @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15, @QueryParams("q") q: string): Promise<Page<Project>> {
        let query = await this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoin("phr.user", "usr")
            .leftJoin("usr.collaborator", "clb")
            .leftJoin("usr.student", "std");

        if (context.scope !== Scope.ADMINISTRATOR) {
            query = query.where((qb) => {
                const subquery = qb.subQuery().from(ProjectHumanResource, "x").select("x.project_id")
                    .where("x.user_id = :userId", { userId: context.user?.id })
                    .getQuery();
                return `p.id IN ${subquery}`;
            });
        }

        if (q) {
            query = query.where(`p.title like %${q}%`)
                .orWhere(`p.program LIKE %${q}%`);
        }

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

    @Post("/")
    public async create(@BodyParams("project") project: Project): Promise<Project | undefined> {
        return this.ProjectRepository.customCreate(project);
    }

    @Put("/")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDINATOR" ] })
    public async update(@Required() @BodyParams("project") project: Project): Promise<any> {
        return this.ProjectRepository.update(project.id, { ...project });
    }

    @Get("/:id")
    @CustomAuth({ scope: [] })
    public async get(@Locals("context") context: IContext, @PathParams("id") id: number): Promise<Project | undefined> {
        // check if user belong to this project.
        const { access } = await this.ProjectRepository.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr", "phr.project_id = :projectId AND phr.user_id = :userId", { projectId: id, userId: context.user.id })
            .select("COUNT(p.id) > 0", "access")
            .getRawOne();
        if (context.scope !== Scope.ADMINISTRATOR && access === 0) {
            throw new Unauthorized("User do not have access to this project.");
        }

        const query = await this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.demands", "demands")
            .leftJoinAndSelect("p.disclosureMedias", "disclosureMedias")
            .leftJoinAndSelect("p.evaluations", "evaluations")
            .leftJoinAndSelect("p.eventPresentations", "eventPresentations")
            .leftJoinAndSelect("p.extensionLines", "extensionLines")
            .leftJoinAndSelect("p.futureDevelopmentPlans", "futureDevelopmentPlans")
            .leftJoinAndSelect("p.knowledgeAreas", "knowledgeAreas")
            .leftJoinAndSelect("p.partners", "partners")
            .leftJoinAndSelect("p.projectTargets", "projectTargets")

            // load public
            .leftJoinAndSelect("p.projectPublics", "projectPublics")
            .leftJoinAndSelect("projectPublics.public", "public")

            // load theme areas
            .leftJoinAndSelect("p.projectThemeAreas", "projectThemeAreas")
            .leftJoinAndSelect("projectThemeAreas.themeArea", "themeArea")

            .leftJoinAndSelect("p.activities", "activities")
            .leftJoinAndSelect("p.attachments", "attachments")

            .leftJoinAndSelect("p.publications", "publications")
            .leftJoinAndSelect("publications.attachment", "publicationsAttachments")
            
            // load human resouces (collaborators and students)
            .leftJoinAndSelect("p.projectHumanResources", "projectHumanResources")
            .leftJoinAndSelect("projectHumanResources.user", "user")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .leftJoinAndSelect("user.student", "student")
            .where("p.id = :id", { id });

        return query.getOne();
    }

    @Delete("/:id")
    @CustomAuth({ scope: [ "ADMINISTRATOR" ] })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.ProjectRepository.deleteById(id);
    }

    @Get("/:id/disclosure-medias")
    @CustomAuth({ scope: [] })
    public async getDisclosureMedia(@Required() @PathParams("id") id: number): Promise<DisclosureMedia[]> {
        return this.DisclosureMediaRepository.createQueryBuilder("dm")
            .innerJoin("dm.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    @Get("/:id/extension-lines")
    @CustomAuth({ scope: [] })
    public async getExtensionLines(@Required() @PathParams("id") id: number): Promise<ExtensionLine[]> {
        return this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/extension-lines")
    @CustomAuth({ scope: [] })
    public async setExtensionLines(
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("entensionLines") entensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} do not exists!`);
        }
        await this.ProjectRepository.createQueryBuilder("project")
            .relation("extensionLines").of(project).add(entensionLines);
    }

    @Get("/:id/knowledge-areas")
    @CustomAuth({ scope: [] })
    public async getKnowledgeAreas(@PathParams("id") id: number): Promise<KnowledgeArea[]> {
        return this.KnowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/knowledge-areas")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async setKnowledgeAreas(@PathParams("id") id: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]): Promise<any> {
        // find project
        const project = await this.ProjectRepository.findById(id);
        
        // create relationship between project and knowledge areas
        return this.ProjectRepository.createQueryBuilder()
            .relation(Project, "knowledgeAreas").of(project).add(knowledgeAreas)
            .then(() => {
                return { message: `Project ${project?.title} was successfully updated.` };
            }).catch(() => {
                throw new Error("Error while updating knowledge areas relationship.");
            });
    }

    @Get("/:id/publics")
    @CustomAuth({ scope: [] })
    public async getPublics(@PathParams("id") id: number): Promise<Public[]> {
        return this.PublicRepository.createQueryBuilder("pb")
            .innerJoinAndSelect("pb.projectPublics", "ppb", "ppb.project_id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/publics")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async setPublics(@PathParams("id") id: number, projectPublics: ProjectPublic[]): Promise<any> {
        // find project
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new NotFound("Project not found!");
        }
        project.projectPublics = projectPublics;
        return this.ProjectRepository.save(project);
    }

    @Get("/:id/theme-areas")
    @CustomAuth({ scope: [] })
    public async getThemeAreas(@PathParams("id") id: number): Promise<ThemeArea[]> {
        return this.ThemeAreaRepository.createQueryBuilder("ta")
            .innerJoinAndSelect("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/theme-areas")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async setThemeAreas(@PathParams("id") id: number, projectThemeAreas: ProjectThemeArea[]): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new NotFound("Project not found!");
        }
        project.projectThemeAreas = projectThemeAreas;
        return this.ProjectRepository.save(project);
    }

    @Get("/:id/targets")
    @CustomAuth({ scope: [] })
    public async getTargets(@PathParams("id") id: number): Promise<ProjectTarget[]> {
        return this.ProjectTargetRepository.createQueryBuilder("pt")
            .innerJoin("pt.project", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/targets")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async setTargets(@PathParams("id") id: number,
        @Required() @BodyParams("projectTargets") projectTargets: ProjectTarget[]): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        
        if (!project) {
            throw new NotFound("Project not found.");
        }

        const targets = await this.ProjectTargetRepository.find({
            join: {
                alias: "pt",
                innerJoinAndSelect: { project: "pt.project" }
            },
            where: { project: { id } }
        });

        targets.map((t) => {
            const f = projectTargets.find((pt) => pt.ageRange === t.ageRange);
            if (f) {
                t.menNumber = f.menNumber;
                t.womenNumber = f.womenNumber;
            }
            return t;
        });
        return this.ProjectTargetRepository.save(targets);
    }

}
