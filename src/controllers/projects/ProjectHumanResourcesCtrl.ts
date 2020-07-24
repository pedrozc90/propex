import { Controller, Locals, Get, Post, QueryParams, PathParams, BodyParams, Required, MergeParams, UseBeforeEach, Delete } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { ProjectValidationMiddleware } from "../../middlewares";
import { Authenticated } from "../../core/services";
import { ProjectRepository, ProjectHumanResourceRepository, UserRepository } from "../../repositories";
import { Page, ProjectHumanResource, ResultContent, User } from "../../entities";
import { Context } from "../../core/models";
import { Scope } from "../../core/types";
import { ScopeEnumTransformer } from "../../core/utils";

@UseBeforeEach(ProjectValidationMiddleware)
@Controller("/:projectId/human-resources")
@MergeParams(true)
export class ProjectHumanResourcesCtrl {

    constructor(
        private projectHumanResourcesRepository: ProjectHumanResourceRepository,
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository) {
        // initialize your stuffs here
    }

    /**
     * Returns a list of collaborators working in a project.
     * @param projectId                     -- project id.
     * @param coordinate                    -- mark if collaborator is a project coordinator.
     * @param exclusive                     -- mark if collaborator is exclusive of the project.
     * @param q                             -- search query.
     */
    @Get("")
    @Authenticated({})
    public async get(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("coordinate") coordinate?: boolean,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("role") role?: Scope | string
    ): Promise<Page<ProjectHumanResource>> {
        if (typeof role === "string") {
            role = ScopeEnumTransformer.from(role);
        }
        // check if user is part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);
        const phrs = await this.projectHumanResourcesRepository.fetch({ page, rpp, q, projectId: project.id, coordinate, exclusive, role });
        return Page.of<ProjectHumanResource>(phrs, page, rpp);
    }

    /**
     * Create / Update ProjectHumandResources.
     * If user is not on database, a new user will be created.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param projectHumanReosurce          -- project human resources data.
     */
    @Post("")
    @Authenticated({ scope: [ "ADMIN", "COORDINATOR" ] })
    public async save(
        @Locals("context") context: Context,
        @Required() @PathParams("projectId") projectId: number,
        @Required() @BodyParams("projectHumanResource") projectHumanReosurce: ProjectHumanResource
    ): Promise<ResultContent<ProjectHumanResource>> {
        const project = await this.projectRepository.findByContext(projectId, context);

        let phr = await this.projectHumanResourcesRepository.findOne({ projectId: project.id, userId: projectHumanReosurce.user.id });
        if (!phr) {
            // create a new project human resource
            phr = this.projectHumanResourcesRepository.create(projectHumanReosurce);
            phr.project = project;

            const userData = projectHumanReosurce.user;

            if (userData.role === Scope.STUDENT && projectHumanReosurce.coordinate === true) {
                throw new BadRequest("Students cannot be a project coordinator.");
            }

            // check if user need to be registered.
            let user = await this.userRepository.findOne({
                where: [
                    { id: userData.id },
                    { email: userData.email },
                    { code: userData.code }
                ]
            });

            // create a new user
            if (!user) {
                user = await this.userRepository.register(userData);
            }

            // make user part of the project
            phr.user = user;
        } else {
            phr = this.projectHumanResourcesRepository.merge(phr, projectHumanReosurce);
        }

        phr = await this.projectHumanResourcesRepository.save(phr);

        return ResultContent.of<ProjectHumanResource>(phr).withMessage("ProjectHumanResources successfully saved.");
    }

    /**
     * Returns a list of students working on this project.
     * @param id                -- project id.
     * @param scholarship       -- mark if student has a scholarship.
     * @param period            -- search for student from a specific period.
     * @param q                 -- search query.
     */
    @Get("/students")
    @Authenticated({})
    public async getStudents(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("scholarship") scholarship?: boolean,
        @QueryParams("period") period?: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<User>> {
        // check if user is part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);
        const users = await this.userRepository.fetch({ page, rpp, q, projectId: project.id, exclusive, period, scholarship, role: Scope.STUDENT });
        return Page.of<User>(users, page, rpp);
    }

    /**
     * Returns a list of collaborators working in a project.
     * @param projectId                     -- project id.
     * @param coordinate                    -- mark if collaborator is a project coordinator.
     * @param exclusive                     -- mark if collaborator is exclusive of the project.
     * @param q                             -- search query.
     */
    @Get("/collaborators")
    @Authenticated({})
    public async getCollaborators(@Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @QueryParams("coordinate") coordinate?: boolean,
        @QueryParams("exclusive") exclusive?: boolean,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<User>> {
        // check if user is part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);
        const users = await this.userRepository.fetch({ page, rpp, q, projectId: project.id, coordinate, exclusive, role: Scope.COLLABORATOR });
        return Page.of<User>(users, page, rpp);
    }

    /**
     * Remove the relationship between a user and a project.
     * @param context                       -- user context.
     * @param projectId                     -- project id.
     * @param userId                        -- user id.
     */
    @Delete("/:userId")
    public async remove(
        @Locals("context") context: Context,
        @PathParams("projectId") projectId: number,
        @PathParams("userId") userId: number
    ): Promise<any> {
        // check if user is part of the current project
        const project = await this.projectRepository.findByContext(projectId, context);

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFound("User not found.");
        }

        const phr = await this.projectHumanResourcesRepository.findOne({ projectId: project.id, userId: user.id });
        if (!phr) {
            throw new NotFound("ProjectHumanResource not found.");
        }

        await this.projectHumanResourcesRepository.remove(phr);

        return { message: "ProjectHumanResource successfully deleted." };
    }

}
