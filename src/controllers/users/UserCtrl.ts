import { Controller, Get, QueryParams, Required, BodyParams, Post, PathParams, Locals, Put, Req, $log } from "@tsed/common";
import { Exception, BadRequest, Unauthorized } from "@tsed/exceptions";
// import { EntityManager, Transaction, TransactionManager } from "typeorm";

import { Authenticated } from "../../core/services";
import { UserRepository, CollaboratorRepository, StudentRepository } from "../../repositories";
import { User, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { Scope } from "../../core/types";

@Controller("/users")
export class UserCtrl {

    constructor(private userRepository: UserRepository,
        private collaboratorRepository: CollaboratorRepository,
        private studentRepository: StudentRepository) {}

    /**
     * Fetch a list of documents using pagination.
     * @param page                          -- page number.
     * @param rpp                           -- number of elements a page contains.
     * @param q                             -- extra query param, used for searching.
     */
    @Get("")
    @Authenticated({ role: "ADMIN" })
    public async fetch(@Locals("context") context: Context,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<User>> {
        const users = await this.userRepository.fetch({ page, rpp, q, projectId });
        return Page.of(users, page, rpp);
    }

    /**
     * Create/Update user information.
     * @param data                          -- user data.
     */
    @Post("")
    @Authenticated({ role: "ADMIN" })
    public async create(
        @Req() request: Req,
        @Required() @BodyParams("user") data: User
    ): Promise<ResultContent<User>> {
        if (!data.collaborator && !data.student) {
            throw new BadRequest("User requires student or collaborator information.");
        }

        let user = await this.userRepository.findUserInfo({ email: data.email });
        if (user) {
            throw new Exception(404, `Email ${user.email} already in use. Please, use PUT ${request.path} to update user information.`);
        }

        // generate a random password for a new user.
        if (!data.password) {
            data.password = this.userRepository.generateRandomPassword();
        }

        // save new user.
        user = this.userRepository.create(data);
        user = await this.userRepository.save(user);
        
        // save collaborator or student data.
        if (data.collaborator) {
            let collaborator = await this.collaboratorRepository.findOne({ profissionalRegistry: data.collaborator.profissionalRegistry });
            if (collaborator) {
                throw new Exception(404, `Registry ${collaborator.profissionalRegistry} already in registrered.`);
            }

            collaborator = this.collaboratorRepository.create(data.collaborator);
            collaborator.user = user;
            collaborator = await this.collaboratorRepository.save(collaborator);

            user.collaborator = collaborator;
            user.role = Scope.COLLABORATOR;
        }
        
        if (data.student) {
            let student = await this.studentRepository.findOne({ code: data.student.code });
            if (student) {
                throw new Exception(404, `Student registration ${student.code} already in use.`);
            }

            student = this.studentRepository.create(data.student);
            student.user = user;
            student = await this.studentRepository.save(student);

            user.student = student;
            user.role = Scope.STUDENT;
        }

        // send email to user to informe the new password
        $log.warn("--------------------------------------------------");
        $log.warn("SEND EMAIL WITH PASSWORD TO THE NEW USER.");
        $log.warn("--------------------------------------------------");
        
        return ResultContent.of<User>(user).withMessage("User was successfully created!");
    }

    /**
     * Create/Update user information.
     * @param data                          -- user data.
     */
    @Put("")
    @Authenticated({ role: "ADMIN" })
    public async save(@Required() @BodyParams("user") data: User): Promise<ResultContent<User>> {
        // check if user exists
        let user = await this.userRepository.findUserInfo({ email: data.email });
        if (!user) {
            throw new Exception(404, "User not found.");
        }

        // merge changes into a user entity.
        user = this.userRepository.merge(user, data);
        
        // save user changes.
        user = await this.userRepository.save(user);

        // update collaborator or student data.
        if (user.collaborator && data.collaborator) {
            let collaborator = await this.collaboratorRepository.findOne({ profissionalRegistry: data.collaborator.profissionalRegistry, user: { id: user.id } });

            collaborator = this.collaboratorRepository.merge(user.collaborator, data.collaborator);
            collaborator = await this.collaboratorRepository.save(collaborator);

            user.collaborator = collaborator;
        }
        
        if (user.student && data.student) {
            let student = this.studentRepository.merge(user.student, data.student);
            student = await this.collaboratorRepository.save(student);

            user.student = student;
        }
        
        // return updated data
        // user = await this.userRepository.findUserInfo({ id: data.id, email: data.email });
        // user.student = stu

        return ResultContent.of<User>(user).withMessage("User changes successfully saved!");
    }

    /**
     * Search user data by its id.
     * @param id                            -- user id.
     */
    @Get("/:id")
    @Authenticated({ scope: [ "ADMIN" ] })
    public async get(@PathParams("id") id: number): Promise<User | undefined> {
        return this.userRepository.findUserInfo({ id });
    }

    /**
     * Ativate a user.
     * @param id                            -- user id.
     */
    @Post("/:id/activate")
    @Authenticated({ role: "ADMIN" })
    public async ativate(
        @Locals("context") context: Context,
        @Required() @PathParams("id") id: number
    ): Promise<any> {
        if (context.user.id === id && context.scope.isAdmin) {
            throw new Unauthorized("Restricted access for administrators.");
        }
        await this.userRepository.update(id, { active: true });
        return { message: "User successfully ativated." };
    }

    /**
     * Desativate a user.
     * @param id                            -- user id.
     */
    @Post("/:id/desactivate")
    @Authenticated({ role: "ADMIN" })
    public async desativate(@Locals("context") context: Context, @Required() @PathParams("id") id: number): Promise<any> {
        if (context.user.id === id && context.scope.isAdmin) {
            throw new Unauthorized("Restricted access for administrators.");
        }
        await this.userRepository.update(id, { active: false });
        return { message: "User successfully desativated." };
    }
    
}
