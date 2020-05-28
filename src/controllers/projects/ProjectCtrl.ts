import { Controller, Locals, Get, Delete, Post, Put, QueryParams, PathParams, BodyParams, Required, $log } from "@tsed/common";
import { HTTPException, Unauthorized, NotFound, BadRequest } from "ts-httpexceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Page, Project, ExtensionLine, ProjectHumanResource, DisclosureMedia, KnowledgeArea, ProjectPublic, Public, ThemeArea, ProjectTarget, ProjectThemeArea, Student, Collaborator, Partner } from "../../entities";
import { IContext, Scope } from "../../types";

import moment from "moment";

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
            .innerJoinAndSelect("phr.user", "usr")
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
            .innerJoin("dm.project", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    @Post("/:id/disclosure-medias")
    @CustomAuth({ scope: [] })
    public async setDisclosureMedia(
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("disclosureMedias") disclosureMedias: DisclosureMedia[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, "Project not found");
        }

        // update existing entities
        const updatedMedias = await this.DisclosureMediaRepository.save(disclosureMedias.filter((d) => !!d.id));

        // save new entities
        const createdMedias = await this.DisclosureMediaRepository.save(
            disclosureMedias.filter((d) => !d.id).map((d) => {
                d.project = project;
                if (!d.date) {
                    d.date = moment().format("YYYY-MM-DD").toString();
                }
                return d;
            })
        );

        return {
            message: "Disclosure Medias successfully updated!",
            updated: updatedMedias.length || 0,
            created: createdMedias.length || 0
        };
    }

    /**
     * Returns all extension lines from a given project.
     * @param id                -- project id.
     */
    @Get("/:id/extension-lines")
    @CustomAuth({ scope: [] })
    public async getExtensionLines(@Required() @PathParams("id") id: number): Promise<ExtensionLine[]> {
        return this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    /**
     * Insert new extension lines to a given project.
     * @param id                -- project id.
     * @param extensionLines    -- list of extension lines (they must exists in the database).
     */
    @Post("/:id/extension-lines")
    @CustomAuth({ scope: [] })
    public async postExtensionLines(
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} not found!`);
        }

        await this.ProjectRepository.createQueryBuilder("project").relation("extensionLines")
            .of(project)
            .add(extensionLines.filter((el) => !!el.id))
            .catch((e: any) => {
                $log.error(e.message);
                throw new BadRequest(e.message, e);
            });

        return { message: "Project extenstion lines changed!" };
    }

    /**
     * Update project extension lines, delete the items not send, and add the new items.
     * @param id                -- project id.
     * @param extensionLines    -- list of extension lines (they must exists in the database).
     */
    @Put("/:id/extension-lines")
    @CustomAuth({ scope: [] })
    public async putExtensionLines(
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} not found!`);
        }
        
        // load extension lines which the project has connection.
        const projectExtensionLines = await this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
        
        // extension lines not send in the request should be removed
        const projectExtensionLinesToDelete = projectExtensionLines.filter((a) => extensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensionLinesToDelete && projectExtensionLinesToDelete.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("extensionLines").of(project).remove(projectExtensionLinesToDelete);
        }

        const projectExtensitonLinesToInsert = extensionLines.filter((a) => !!a.id && projectExtensionLines.findIndex((b) => b.id === a.id) < 0);
        if (projectExtensitonLinesToInsert && projectExtensitonLinesToInsert.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("extensionLines").of(project).add(projectExtensitonLinesToInsert);
        }

        return { message: "Project extension lines updated!" };
    }

    /**
     * Return all knowledge areas from a given project.
     * @param id                    -- project id.
     */
    @Get("/:id/knowledge-areas")
    @CustomAuth({ scope: [] })
    public async getKnowledgeAreas(@PathParams("id") id: number): Promise<KnowledgeArea[]> {
        return this.KnowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    /**
     * Create relationship between project and knowledge areas.
     * @param id                    -- project id.
     * @param knowledgeAreas        -- list of knwoledge areas to add.
     */
    @Post("/:id/knowledge-areas")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async postKnowledgeAreas(@PathParams("id") id: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} not found!`);
        }

        await this.ProjectRepository.createQueryBuilder("project").relation("knowledgeAreas")
            .of(project)
            .add(knowledgeAreas.filter((ka) => !!ka.id))
            .catch((e: any) => {
                $log.error(e.message);
                throw new BadRequest(e.message, e);
            });

        return { message: "Project knowledge areas changed!" };
    }

    /**
     * Update project knowledge areas realationship, delete the items not send, and add the new items.
     * @param id                -- project id.
     * @param knowledgeAreas    -- list of knwoledge areas (they must exists in the database).
     */
    @Put("/:id/knowledge-areas")
    @CustomAuth({ scope: [] })
    public async putKnowledgeAreas(
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new HTTPException(400, `Project ${id} not found!`);
        }
        
        // load extension lines which the project has connection.
        const projectKnowledgeAreas = await this.KnowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
        
        // extension lines not send in the request should be removed
        const projectKnowledgeAreasToDelete = projectKnowledgeAreas.filter((a) => knowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (projectKnowledgeAreasToDelete && projectKnowledgeAreasToDelete.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("knowledgeAreas").of(project).remove(projectKnowledgeAreasToDelete);
        }

        const projectKnowledgeAreasToInsert = knowledgeAreas.filter((a) => !!a.id && projectKnowledgeAreas.findIndex((b) => b.id === a.id) < 0);
        if (projectKnowledgeAreasToInsert && projectKnowledgeAreasToInsert.length > 0) {
            await this.ProjectRepository.createQueryBuilder("project").relation("knowledgeAreas").of(project).add(projectKnowledgeAreasToInsert);
        }

        return { message: "Project Knowledge Areas updated!" };
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

    /**
     * Return the list of theme areas connected to a given project.
     * @param id                    -- project id.
     */
    @Get("/:id/theme-areas")
    @CustomAuth({ scope: [] })
    public async getThemeAreas(@PathParams("id") id: number): Promise<{ main: ThemeArea[], secondary: ThemeArea[] }> {
        const query = this.ThemeAreaRepository.createQueryBuilder("ta")
            .innerJoin("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId: id });
            
        const main = await query.where("pta.main = 1").getMany();

        const secondary = await query.where("pta.main = 0").getMany();

        return { main, secondary };
    }

    /**
     * Save project theme areas.
     * @param id                    -- project id.
     * @param main                  -- list of main theme areas.
     * @param secondary             -- list of secondary theme areas.
     */
    @Post("/:id/theme-areas")
    @CustomAuth({ scope: [ "ADMINISTRATOR", "COORDENATOR" ] })
    public async setThemeAreas(
        @PathParams("id") id: number,
        @BodyParams("main") main: ThemeArea[],
        @BodyParams("secondary") secondary: ThemeArea[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findById(id);
        if (!project) {
            throw new NotFound("Project not found!");
        }

        const projectThemeAreas: ProjectThemeArea[] = [];

        projectThemeAreas.push(
            ...main.map((ta) => {
                const pta = new ProjectThemeArea();
                pta.main = true;
                pta.project = project;
                pta.themeArea = ta;
                return pta;
            })
        );

        projectThemeAreas.push(
            ...secondary.map((ta) => {
                const pta = new ProjectThemeArea();
                pta.main = false;
                pta.project = project;
                pta.themeArea = ta;
                return pta;
            })
        );

        // await this.ProjectThemeAreaRepository.save(projectThemeAreas)
        //     .catch((e) => {
        //         $log.error(e.message);
        //         throw new BadRequest(e.message);
        //     });
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

    /**
     * Returns a list of students working on this project.
     * @param id                -- project id.
     * @param scholarship       -- mark if student has a scholarship.
     * @param period            -- search for student from a specific period.
     * @param q                 -- search query.
     */
    @Get("/:id/students")
    public async getStudents(
        @PathParams("id") id: number,
        @QueryParams("scholarship") scholarship?: boolean,
        @QueryParams("period") period?: string,
        @QueryParams("q") q?: string
    ): Promise<Student[]> {
        let query = this.StudentRepository.createQueryBuilder("std")
            .innerJoinAndSelect("std.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr")
            .innerJoin("phr.project", "p", "p.id = :projectId", { projectId: id });
        
        if (scholarship !== undefined && scholarship !== null) {
            query = query.where("std.scholarship = :scholarship", { scholarship: (scholarship) ? 1 : 0 });
        }

        // NÃO FUNCIONA (???)
        if (period) {
            query = query.where(`std.period = '${period}'`);
        }

        if (q) {
            query = query.where(`std.code LIKE '%${q}%'`)
                .orWhere(`std.course LIKE '%${q}%'`)
                .orWhere(`usr.name LIKE '%${q}%'`);
        }

        return query.getMany();
    }

    @Post("/:id/students")
    public async postStudents(@PathParams("id") id: number, @Required() @BodyParams("students") students: Student[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

    @Put("/:id/students")
    public async putStudents(@PathParams("id") id: number, @Required() @BodyParams("students") students: Student[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

    /**
     * Returns a list of collaborators working in a project.
     * @param id                -- project id.
     * @param coordinate        -- mark if collaborator is a project coordinator.
     * @param exclusive         -- mark if collaborator is exclusive of the project.
     * @param q                 -- search query.
     */
    @Get("/:id/collaborators")
    public async getCollaborators(
        @PathParams("id") id: number,
        @QueryParams("coordinate") coordinate?: boolean,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("q") q?: string
    ): Promise<Collaborator[]> {
        let query = this.CollaboratorRepository.createQueryBuilder("clb")
            .innerJoinAndSelect("clb.user", "usr")
            .innerJoinAndSelect("usr.projectHumanResources", "phr")
            .innerJoin("phr.project", "p", "p.id = :projectId", { projectId: id });
        
        if (coordinate !== undefined && coordinate !== null) {
            query = query.where("phr.coordinate = :coordinate", { coordinate: (coordinate) ? 1 : 0 });
        }

        if (exclusive !== undefined && exclusive !== null) {
            query = query.where("phr.exclusive = :exclusive", { exclusive: (exclusive) ? 1 : 0 });
        }

        if (q) {
            query = query.where(`std.academic_function LIKE '%${q}%'`)
                .orWhere(`std.profissional_registry LIKE '%${q}%'`)
                .orWhere(`std.affiliation LIKE '%${q}%'`)
                .orWhere(`usr.name LIKE '%${q}%'`);
        }

        return query.getMany();
    }

    @Post("/:id/collaborators")
    public async postCollaborators(@PathParams("id") id: number, @Required() @BodyParams("collaborators") collaborators: Collaborator[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

    @Put("/:id/collaborators")
    public async putCollaborators(@PathParams("id") id: number, @Required() @BodyParams("collaborators") collaborators: Collaborator[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

/**  
 * PARTERNS
 */ 
    @Get("/:id/parterns")
    public async getParterns(@PathParams("id") id: number): Promise<Partner[]> {
        return[];
    }

    @Post("/:id/parterns")
    public async postParterns(@PathParams("id") id: number, @Required() @BodyParams("parterns") collaborators: Collaborator[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

    @Delete("/:id/parterns")
    @CustomAuth({ scope: [ "ADMINISTRATOR" ] })
    public async deleteParterns(@PathParams("id") id: number, @Required() @BodyParams("parterns") collaborators: Collaborator[]): Promise<any> {
        return this.ProjectRepository.deleteById(id);
    }

/**  
* EVALUATION  
*/ 
    @Get("/:id/evaluation")
    public async getEvaluation(@PathParams("id") id: number): Promise<Partner[]> {
    return[];
    }

    @Post("/:id/evaluation")
    public async postEvaluation(@PathParams("id") id: number, @Required() @BodyParams("evaluation") collaborators: Collaborator[]): Promise<any> {
        return { message: "Method not implemented!" };
    }

    @Delete("/:id/evaluation")
    @CustomAuth({ scope: [ "ADMINISTRATOR" ] })
    public async deleteEvaluation(@PathParams("id") id: number, @Required() @BodyParams("evaluation") collaborators: Collaborator[]): Promise<any> {
        return this.ProjectRepository.deleteById(id);
    }

}
