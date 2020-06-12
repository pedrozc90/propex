import { Controller, Get, QueryParams, Required, BodyParams, Post, PathParams, Locals, Put, Req, $log } from "@tsed/common";
import { Exception, BadRequest, Unauthorized } from "@tsed/exceptions";
// import { EntityManager, Transaction, TransactionManager } from "typeorm";

import { CustomAuth } from "../../services";
import { UserRepository, CollaboratorRepository, StudentRepository } from "../../repositories";
import { User, Page, ResultContent } from "../../entities";
import { IContext } from "src/types";

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
    @CustomAuth({ role: "ADMIN" })
    public async fetch(@Locals("context") context: IContext,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<User>> {
        const query = this.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.student", "student")
            .leftJoinAndSelect("user.collaborator", "collaborator");

        if (q) {
            query.where("user.email LIKE :email", { email: `%${q}%` })
                .orWhere("user.name LIKE :name", { name: `%${q}%` });
        }
            
        query.skip((page - 1) * rpp)
            .take(rpp)
            .getMany();

        return Page.of(await query.getMany(), page, rpp);
    }

    /**
     * Create/Update user information.
     * @param data                          -- user data.
     */
    @Post("")
    @CustomAuth({ role: "ADMIN" })
    public async create(@Req() request: Req, @Required() @BodyParams("user") data: User): Promise<ResultContent<User>> {
        if (data.id) {
            throw new BadRequest(`Please, try PUT ${request.path} to update users information.`);
        }
        if (!data.collaborator && !data.student) {
            throw new BadRequest("Missing student or collaborator information.");
        }

        let user = await this.userRepository.findOne({ id: data.id, email: data.email });
        if (user) {
            throw new Exception(404, "User already exists!");
        }

        // generate a random password for a new user.
        if (!data.password) {
            data.password = this.userRepository.generateRandomPassword();
        }

        // save new user.
        user = await this.userRepository.save(data);

        // save collaborator or student data.
        if (data.collaborator) {
            let collaborator = this.collaboratorRepository.create(data.collaborator);
            collaborator.user = user;
            collaborator = await this.collaboratorRepository.save(collaborator);
        } else if (data.student) {
            let student = this.studentRepository.create(data.student);
            student.user = user;
            student = await this.studentRepository.save(student);
        }

        // send email to user to informe the new password
        $log.warn("EMAIL METHOD NOT IMPLEMENTED");

        user = await this.userRepository.findUserInfo({ id: data.id, email: data.email });
        
        return ResultContent.of<User>(user).withMessage("User was successfully created!");
    }

    /**
     * Create/Update user information.
     * @param data                          -- user data.
     */
    @Put("")
    @CustomAuth({ role: "ADMIN" })
    public async save(@Required() @BodyParams("user") data: User): Promise<ResultContent<User>> {
        // check if user exists
        let user = await this.userRepository.findUserInfo({ id: data.id, email: data.email });
        if (!user) {
            throw new Exception(404, "User not found.");
        }

        // merge changes into a user entity.
        user = this.userRepository.merge(user, data);
        
        // save user changes.
        user = await this.userRepository.save(user);

        // update collaborator or student data.
        if (user.collaborator && data.collaborator) {
            await this.collaboratorRepository.update(user.collaborator.id, { ...data.collaborator });
        } else if (user.student && data.student) {
            await this.collaboratorRepository.update(user.student.id, { ...data.student });
        }
        
        // return updated data
        user = await this.userRepository.findUserInfo({ id: data.id, email: data.email });

        return ResultContent.of<User>(user).withMessage("User changes successfully saved!");
    }

    /**
     * Search user data by its id.
     * @param id                            -- user id.
     */
    @Get("/:id")
    @CustomAuth({ scope: [ "ADMIN" ] })
    public async get(@PathParams("id") id: number): Promise<User | undefined> {
        return this.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.student", "student")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .where("user.id = :id", { id })
            .getOne();
    }

    /**
     * Ativate a user.
     * @param id                            -- user id.
     */
    @Post("/:id/activate")
    @CustomAuth({ role: "ADMIN" })
    public async ativate(@Locals("context") context: IContext, @Required() @PathParams("id") id: number): Promise<any> {
        if (context.user.id === id && context.scope.isAdmin) {
            throw new Unauthorized("Invalid action fot admin users.");
        }
        await this.userRepository.update(id, { active: true });
        return { message: "User successfully ativated." };
    }

    /**
     * Desativate a user.
     * @param id                            -- user id.
     */
    @Post("/:id/desactivate")
    @CustomAuth({ role: "ADMIN" })
    public async desativate(@Locals("context") context: IContext, @Required() @PathParams("id") id: number): Promise<any> {
        if (context.user.id === id && context.scope.isAdmin) {
            throw new Unauthorized("Invalid action fot admin users.");
        }
        await this.userRepository.update(id, { active: false });
        return { message: "User successfully desativated." };
    }
    
}
