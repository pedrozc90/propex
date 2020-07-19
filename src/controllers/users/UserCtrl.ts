import { Controller, Get, QueryParams, Required, BodyParams, Post, PathParams, Locals, Put, Req } from "@tsed/common";
import { Exception, Unauthorized } from "@tsed/exceptions";
// import { EntityManager, Transaction, TransactionManager } from "typeorm";

import { Authenticated } from "../../core/services";
import { UserRepository } from "../../repositories";
import { User, Page, ResultContent } from "../../entities";
import { Context } from "../../core/models";
import { Scope } from "../../core/types";
import { ScopeEnumTransformer } from "../../core/utils";

@Controller("/users")
export class UserCtrl {

    constructor(private userRepository: UserRepository) {}

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
        @QueryParams("project") projectId?: number,
        @QueryParams("role") role?: Scope | string
    ): Promise<Page<User>> {
        if (typeof role === "string") {
            role = ScopeEnumTransformer.from(role);
        }

        const users = await this.userRepository.fetch({ page, rpp, q, projectId, role: role });
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
        @Required() @BodyParams("user") user: User
    ): Promise<ResultContent<User>> {
        user = await this.userRepository.register(user);
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

        // save collaborator or student data.
        if (user.role === Scope.COLLABORATOR) {
            data.scholarship = false;
            data.period = null;
        } else if (user.role === Scope.STUDENT) {
            data.academicFunction = null;
            data.affiliation = null;
        }

        // merge changes into a user entity.
        user = this.userRepository.merge(user, data);
        
        // save user changes.
        user = await this.userRepository.save(user);

        return ResultContent.of<User>(user).withMessage("User changes successfully saved!");
    }

    /**
     * Return a list of scopes.
     */
    @Get("/scopes")
    @Authenticated({})
    public async getScopes(): Promise<Scope[]> {
        return Scope.list;
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
