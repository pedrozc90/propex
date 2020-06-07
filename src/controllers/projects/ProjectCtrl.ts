import { Controller, Locals, Get, Delete, Post, Put, QueryParams, PathParams, BodyParams, Required, $log } from "@tsed/common";
import { Exception, Unauthorized, BadRequest, NotFound, NotImplemented } from "@tsed/exceptions";

import { CustomAuth } from "../../services";
import * as Repo from "../../repositories";
import { Collaborator, DisclosureMedia, Evaluation, ExtensionLine, KnowledgeArea,
    Page, Partner, Project, ProjectBasic, ProjectHumanResource, Target,
    ProjectThemeArea, Public, Student, ThemeArea, User, ResultContent, Activity, Demand } from "../../entities";
import { IContext, Scope, AgeRange } from "../../types";

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
        private EventRepository: Repo.EventRepository,
        private ExtensionLineRepository: Repo.ExtensionLineRepository,
        private FutureDevelopmentPlanRepository: Repo.FutureDevelopmentPlanRepository,
        private KnowledgeAreaRepository: Repo.KnowledgeAreaRepository,
        private PartnerRepository: Repo.PartnerRepository,
        private ProjectRepository: Repo.ProjectRepository,
        private ProjectHumanResourceRepository: Repo.ProjectHumanResourceRepository,
        private ProjectPublicRepository: Repo.ProjectPublicRepository,
        private TargetRepository: Repo.TargetRepository,
        private ProjectThemeAreaRepository: Repo.ProjectThemeAreaRepository,
        private PublicRepository: Repo.PublicRepository,
        private PublicationRepository: Repo.PublicationRepository,
        private StudentRepository: Repo.StudentRepository,
        private ThemeAreaRepository: Repo.ThemeAreaRepository,
        private UserRepository: Repo.UserRepository) {
        // initialize stuff here
    }

    /**
     * Return a paginated list of projects, which the user is associated with.
     * @param context                       -- user context.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query string (search).
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(@Locals("context") context: IContext,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q: string
    ): Promise<Page<Project>> {
        let query = this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.projectHumanResources", "phr")
            .innerJoinAndSelect("phr.user", "usr")
            .leftJoin("usr.collaborator", "clb")
            .leftJoin("usr.student", "std");

        if (context.scope !== Scope.ADMIN) {
            query = query.where((qb) => {
                const subquery = qb.subQuery().from(ProjectHumanResource, "hr").select("hr.project_id")
                    .where("hr.user_id = :userId", { userId: context.user?.id })
                    .getQuery();
                return `p.id IN ${subquery}`;
            });
        }

        if (q) {
            query = query.where("p.title LIKE :title", { title: `%${q}%` })
                .orWhere("p.program LIKE :program", { program: `%${q}%` });
        }

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of<Project>(await query.getMany(), page, rpp);
    }

    /**
     * Create a new project.
     * @param context                       -- user context.
     * @param project                       -- project data.
     */
    @Post("/")
    @CustomAuth({ scope: [ "ADMIN" ] })
    public async create(@Locals("context") context: IContext,
        @Required() @BodyParams("project") data: ProjectBasic,
        @Required() @BodyParams("coordinator") coordinator: User
    ): Promise<ResultContent<any>> {
        if (!coordinator) {
            throw new BadRequest("Required coordinator was not send!");
        }
        
        const user = await this.UserRepository.findByIdOrEmail({ id: coordinator.id, email: coordinator.email });
        if (!user) {
            throw new Exception(404, "Please, coodinator user is not registed.");
        }

        // create a new project
        let project = new Project();
        project.title = data.title;
        project.program = data.program;
        project = await this.ProjectRepository.save(project).catch((err: Error) => {
            throw new Exception(404, "Unable to save new project.", err);
        });
        
        // define user as project coordinator
        const phr = new ProjectHumanResource();
        phr.coordinate = true;
        phr.exclusive = true;
        phr.workload = 48;
        phr.project = project;
        phr.user = user;

        await this.ProjectHumanResourceRepository.save(phr)
            .catch((error: Error) => $log.error(error.message));

        // create the default targets for this project.
        const targets = this.TargetRepository.default(project);
        await this.TargetRepository.save(targets);

        return ResultContent.of({ id: project.id, title: project.title }).withMessage("Project successfully created!");
    }

    @Put("/")
    @CustomAuth({})
    public async update(@Locals("context") context: IContext,
        @Required() @BodyParams("project") data: Project
    ): Promise<ResultContent<Project>> {
        // check if project exists.
        let project = await this.ProjectRepository.findById(data.id);
        if (!project) {
            throw new Exception(404, "Project not found!");
        }

        // update knowledge areas changes.
        if (data.knowledgeAreas) {
            await this.KnowledgeAreaRepository.overwrite(project, data.knowledgeAreas);
        }

        $log.warn("WORKING");

        project = this.ProjectRepository.merge(project, data);

        return ResultContent.of<Project>(project).withMessage("success");
    }

    /**
     * Search data of a given project.
     * @param context                       -- user context.
     * @param id                            -- project id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number
    ): Promise<Project | undefined> {
        // check if user belong to this project.
        const { access } = await this.ProjectRepository.createQueryBuilder("p")
            .innerJoin("p.projectHumanResources", "phr", "phr.project_id = :projectId AND phr.user_id = :userId", { projectId: id, userId: context.user.id })
            .select("COUNT(p.id) > 0", "access")
            .getRawOne();
        
        // user need to be a administrator or need to be associate to the project.
        if (context.scope !== Scope.ADMIN && access === 0) {
            throw new Unauthorized("User do not have access to this project.");
        }

        // load project and all his relationships.
        const query = await this.ProjectRepository.createQueryBuilder("p")
            .leftJoinAndSelect("p.demands", "demands")
            .leftJoinAndSelect("p.disclosureMedias", "disclosureMedias")
            .leftJoinAndSelect("p.evaluations", "evaluations")
            .leftJoinAndSelect("p.events", "event")
            .leftJoinAndSelect("p.extensionLines", "extensionLines")
            .leftJoinAndSelect("p.futureDevelopmentPlans", "futureDevelopmentPlans")
            .leftJoinAndSelect("p.knowledgeAreas", "knowledgeAreas")
            .leftJoinAndSelect("p.partners", "partners")
            .leftJoinAndSelect("p.targets", "targets")

            // load public
            .leftJoinAndSelect("p.projectPublics", "projectPublics")
            .leftJoinAndSelect("projectPublics.public", "public")

            // load theme areas
            .leftJoinAndSelect("p.projectThemeAreas", "projectThemeArea")
            .leftJoinAndSelect("projectThemeArea.themeArea", "themeArea")

            .leftJoinAndSelect("p.activities", "activities")
            .leftJoinAndSelect("p.attachments", "attachments")

            .leftJoinAndSelect("p.publications", "publications")
            .leftJoinAndSelect("publications.attachment", "publicationsAttachments")
            
            // load human resouces (collaborators and students)
            .leftJoinAndSelect("p.projectHumanResources", "projectHumanResource")
            .leftJoinAndSelect("projectHumanResource.user", "user")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .leftJoinAndSelect("user.student", "student")
            .where("p.id = :id", { id });

        return query.getOne();
    }

    // --------------------------------------------------
    // ACTIVITIES
    // --------------------------------------------------

    /**
     * Return a list of activities tied to a project.
     * @param context                       -- user context.
     * @param id                            -- project id.
     * @param page                          -- page number.
     * @param rpp                           -- row per page.
     * @param q                             -- query string.
     * @param initDate                      -- initial date.
     * @param lastDate                      -- last date.
     */
    @Get("/:id/activities")
    @CustomAuth({})
    public async getActivities(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("init_date") initDate?: string,
        @QueryParams("last_date") lastDate?: string
    ): Promise<Page<Activity>> {
        let query = this.ActivityRepository.createQueryBuilder("activity")
            .innerJoin("activity.project", "project", "project.id =: id", { id });

        if (q) {
            query = query.where("activity.name LIKE :name", { name: `%${q}%` })
                .orWhere("activity.description LIKE :description", { description: `%${q}%` });
        }

        if (initDate) query = query.where(`activity.date > ${initDate}`);
        if (lastDate) query = query.where(`activity.date < ${lastDate}`);

        query = query.skip((page - 1) * rpp).take(rpp);

        return Page.of(await query.getMany(), page, rpp);
    }

    // --------------------------------------------------
    // COLLABORATORS
    // --------------------------------------------------

    /**
     * Returns a list of collaborators working in a project.
     * @param id                            -- project id.
     * @param coordinate                    -- mark if collaborator is a project coordinator.
     * @param exclusive                     -- mark if collaborator is exclusive of the project.
     * @param q                             -- search query.
     */
    @Get("/:id/collaborators")
    @CustomAuth({})
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
            query = query.where("std.academic_function LIKE :function", { function: `%${q}%` })
                .orWhere("std.profissional_registry LIKE :registry", { registry: `%${q}%` })
                .orWhere("std.affiliation LIKE :affiliation", { affiliation: `%${q}%` })
                .orWhere("usr.name LIKE :name", { name: `%${q}%` })
                .orWhere("usr.email LIKE :email", { email: `%${q}%` });
        }

        return query.getMany();
    }

    @Post("/:id/collaborators")
    @CustomAuth({})
    public async postCollaborators(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("collaborators") collaborators: Collaborator[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        throw new NotImplemented("Method Not Implmented.");
    }

    // --------------------------------------------------
    // DEMANDS
    // --------------------------------------------------

    /**
     * Return a list of disclosure medias that belongs to a project.
     * @param id                -- project id.
     */
    @Get("/:id/demands")
    @CustomAuth({})
    public async getDemands(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number
    ): Promise<Demand[]> {
        return this.DemandRepository.createQueryBuilder("d")
            .innerJoin("d.project", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    // --------------------------------------------------
    // DISCLOSURE MEDIAS
    // --------------------------------------------------

    /**
     * Return a paginated list of disclosure medias that belongs to a project.
     * @param id                            -- project id.
     */
    @Get("/:id/disclosure-medias")
    @CustomAuth({})
    public async getDisclosureMedia(@Required() @PathParams("id") id: number,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("date") date?: string,
        @QueryParams("from") from?: string,
        @QueryParams("to") to?: string
    ): Promise<Page<DisclosureMedia>> {
        let query = this.DisclosureMediaRepository.createQueryBuilder("dm")
            .innerJoin("dm.project", "p", "p.id = :projectId", { projectId: id });
        
        if (q) {
            query = query.where("dm.name LIKE :name", { name: `%${q}%` })
                .orWhere("dm.link LIKE :link", { name: `%${q}%` });
        }

        if (date) query = query.where("dm.date = :date", { date });
        if (from) query = query.where("dm.date >= :from", { from });
        if (to) query = query.where("dm.date <= :to", { to });

        query = query.orderBy("dm.date", "DESC")
            .skip((page - 1) * rpp)
            .take(rpp);
        
        return Page.of<DisclosureMedia>(await query.getMany(), page, rpp);
    }

    /**
     * Create/Update disclosure medias from a project.
     * @param id                            -- project id
     * @param disclosureMedias              -- disclosure medias data.
     */
    @Post("/:id/disclosure-medias")
    @CustomAuth({})
    public async setDisclosureMedia(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("disclosureMedias") disclosureMedias: DisclosureMedia[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.ProjectRepository.findByContext(id, context);

        // update existing entities
        let mediasToUpdate = await Promise.all(
            disclosureMedias.filter((dm) => !!dm.id).map(async (dm) => {
                const tmp = await this.DisclosureMediaRepository.findOne({ id: dm.id });
                if (!tmp) {
                    throw new NotFound(`Disclosure media ${dm.id} do not exists.`);
                }
                return this.DisclosureMediaRepository.merge(tmp, dm);
            })
        );
        
        if (mediasToUpdate.length > 0) {
            mediasToUpdate = await this.DisclosureMediaRepository.save(mediasToUpdate);
        }

        // save new entities
        let mediasToInsert = disclosureMedias.filter((d) => !d.id).map((d) => {
            d.project = project;
            if (!d.date) d.date = moment().format("YYYY-MM-DD").toString();
            return d;
        });
        if (mediasToInsert.length > 0) {
            mediasToInsert = await this.DisclosureMediaRepository.save(mediasToInsert);
        }

        const result = {
            updated: mediasToUpdate.length || 0,
            inserted: mediasToInsert.length || 0
        };

        return ResultContent.of<any>(result).withMessage("Disclosure Medias successfully updated!");
    }

    // --------------------------------------------------
    // EXTENSION LINES
    // --------------------------------------------------

    /**
     * Returns all extension lines from a given project.
     * @param id                            -- project id.
     */
    @Get("/:id/extension-lines")
    @CustomAuth({})
    public async getExtensionLines(@Required() @PathParams("id") id: number): Promise<ExtensionLine[]> {
        return this.ExtensionLineRepository.createQueryBuilder("el")
            .innerJoin("el.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    /**
     * Create/Update/Delete project extension lines, delete the items not send, and add the new items.
     * @param id                -- project id.
     * @param extensionLines    -- list of extension lines (they must exists in the database).
     */
    @Post("/:id/extension-lines")
    @CustomAuth({})
    public async postExtensionLines(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("extensionLines") extensionLines: ExtensionLine[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
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

    // --------------------------------------------------
    // EVALUATIONS
    // --------------------------------------------------

    @Get("/:id/evaluations")
    @CustomAuth({})
    public async getEvaluation(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number
    ): Promise<Partner[]> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        return [];
    }

    @Post("/:id/evaluations")
    @CustomAuth({})
    public async postEvaluation(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("evaluations") evaluations: Evaluation[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        throw new NotImplemented("Method Not Implmented.");
    }

    // --------------------------------------------------
    // KNOWLEDGE AREAS
    // --------------------------------------------------

    /**
     * Return all knowledge areas from a given project.
     * @param id                            -- project id.
     */
    @Get("/:id/knowledge-areas")
    @CustomAuth({})
    public async getKnowledgeAreas(@PathParams("id") id: number): Promise<KnowledgeArea[]> {
        return this.KnowledgeAreaRepository.createQueryBuilder("ka")
            .innerJoin("ka.projects", "p", "p.id = :projectId", { projectId: id })
            .getMany();
    }

    /**
     * Overwrite project knowledge areas, delete the items not send, and add the new items.
     * @param id                            -- project id.
     * @param knowledgeAreas                -- list of knwoledge areas (they must exists in the database).
     */
    @Post("/:id/knowledge-areas")
    @CustomAuth({})
    public async postKnowledgeAreas(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("knowledgeAreas") knowledgeAreas: KnowledgeArea[]
    ): Promise<ResultContent<KnowledgeArea[]>> {
        // select project with user is part of.
        const project = await this.ProjectRepository.findByContext(id, context);

        // save project knowledge areas relationship.
        const savedKnowledgeAreas = await this.KnowledgeAreaRepository.overwrite(project, knowledgeAreas);

        return ResultContent.of<KnowledgeArea[]>(savedKnowledgeAreas).withMessage("Project knowledge areas successfully saved!");
    }

    // --------------------------------------------------
    // PARTERNS
    // --------------------------------------------------

    @Get("/:id/parterns")
    @CustomAuth({})
    public async getParterns(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number): Promise<Partner[]> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        throw new NotImplemented("Method Not Implmented.");
    }

    @Post("/:id/parterns")
    @CustomAuth({})
    public async postParterns(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("parterns") parterns: Partner[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        throw new NotImplemented("Method Not Implmented.");
    }

    // --------------------------------------------------
    // PUBLICS
    // --------------------------------------------------

    /**
     * Return all publics from a given project.
     * @param id                            -- project id.
     * @param directly                      -- filter direct publics.
     */
    @Get("/:id/publics")
    @CustomAuth({})
    public async getPublics(
        @Required() @PathParams("id") id: number,
        @QueryParams("directly") directly?: boolean
    ): Promise<Public[]> {
        let query = this.PublicRepository.createQueryBuilder("pb")
            .innerJoinAndSelect("pb.projectPublics", "ppb", "ppb.project_id = :projectId", { projectId: id });
        
        if (directly) {
            query = query.where("ppb.directly = :directly", { directly: (directly) ? 1 : 0 });
        }

        return query.getMany();
    }

    /**
     * Overwrite project publics.
     * @param context                       -- user context.
     * @param id                            -- project id.
     * @param publics                       -- project publics data.
     */
    @Post("/:id/publics")
    @CustomAuth({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async setPublics(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("publics") publics: Public[]
    ): Promise<ResultContent<Public[]>> {
        // check if user is part of project.
        const project = await this.ProjectRepository.findByContext(id, context);
        
        // update project publics.
        // const savedPublics = await this.PublicRepository.overwrite(project, publics);

        // return ResultContent.of<Public[]>(savedPublics).withMessage("Project publics successfully saved!");
        throw new NotImplemented("Method Not Implemented!");
    }

    // --------------------------------------------------
    // STUDENTS
    // --------------------------------------------------

    /**
     * Returns a list of students working on this project.
     * @param id                -- project id.
     * @param scholarship       -- mark if student has a scholarship.
     * @param period            -- search for student from a specific period.
     * @param q                 -- search query.
     */
    @Get("/:id/students")
    @CustomAuth({})
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
    @CustomAuth({})
    public async postStudents(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("students") students: Student[]
    ): Promise<any> {
        const project = await this.ProjectRepository.findByContext(id, context);
        if (!project) {
            throw new Exception(400, "Project not found");
        }
        throw new NotImplemented("Method Not Implmented.");
    }

    // --------------------------------------------------
    // TARGETS
    // --------------------------------------------------

    /**
     * Return the list of targets witch the project attends.
     * @param id                            -- project id.
     */
    @Get("/:id/targets")
    @CustomAuth({})
    public async getTargets(@PathParams("id") id: number): Promise<{ targets: Target[], total: number }> {
        const query = this.TargetRepository.createQueryBuilder("pt")
            .innerJoin("pt.project", "p", "p.id = :projectId", { projectId: id });
        
        const targets = await query.getMany();

        const { total } = await query.select("COALESCE(SUM(pt.men_number) + SUM(pt.women_number), 0)", "total")
            .getRawOne();

        return { targets, total: parseInt(total) };
    }

    /**
     * Returns
     * @param id                            -- project id.
     * @param targets                -- project targets.
     */
    @Post("/:id/targets")
    @CustomAuth({})
    public async setTargets(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @Required() @BodyParams("targets") targets: Target[]
    ): Promise<any> {
        // select project if user is part of it.
        const project = await this.ProjectRepository.findByContext(id, context);

        // update project target based on receiver array, and return the new array of targets.
        const savedTargets = await this.TargetRepository.overwrite(project, targets);

        return ResultContent.of<Target[]>(savedTargets).withMessage("Target successfully saved.");
    }

    // --------------------------------------------------
    // THEME AREAS
    // --------------------------------------------------

    /**
     * Return the list of theme areas connected to a given project.
     * @param id                            -- project id.
     */
    @Get("/:id/theme-areas")
    @CustomAuth({})
    public async getThemeAreas(@PathParams("id") id: number): Promise<{ main: ThemeArea[], secondary: ThemeArea[] }> {
        const query = this.ThemeAreaRepository.createQueryBuilder("ta")
            .innerJoin("ta.projectThemeAreas", "pta", "pta.project_id = :projectId", { projectId: id });
        
        // load project's main theme areas
        const main = await query.where("pta.main = 1").getMany();

        // load project's secondary theme areas
        const secondary = await query.where("pta.main = 0").getMany();

        return { main, secondary };
    }

    /**
     * Save project theme areas.
     * @param id                            -- project id.
     * @param main                          -- list of main theme areas.
     * @param secondary                     -- list of secondary theme areas.
     */
    @Post("/:id/theme-areas")
    @CustomAuth({ scope: [ "ADMIN", "COORDENATOR" ] })
    public async setThemeAreas(
        @Locals("context") context: IContext,
        @Required() @PathParams("id") id: number,
        @BodyParams("main") main?: ThemeArea[],
        @BodyParams("secondary") secondary?: ThemeArea[]
    ): Promise<any> {
        // check if user is part of project.
        const project = await this.ProjectRepository.findByContext(id, context);

        // create project theme aread
        const projectThemeAreas = await this.ProjectThemeAreaRepository.overwrite(project, main, secondary);

        return ResultContent.of<ProjectThemeArea[]>(projectThemeAreas).withMessage("Project Theme Areas successfully saved.");
    }

}
