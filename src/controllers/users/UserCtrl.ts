import { Controller, Get, QueryParams, Required, BodyParams, Post, PathParams } from "@tsed/common";
// import { EntityManager, Transaction, TransactionManager } from "typeorm";

import { UserRepository } from "../../repositories";
import { User, Page, ResultContent, UserBasic } from "../../entities";
import { CustomAuth } from "../../services";
import { Exception } from "@tsed/exceptions";

@Controller("/users")
export class UserCtrl {

    constructor(private userRepository: UserRepository) {}

    /**
     * Fetch a list of documents using pagination.
     * @param page  -- page number
     * @param rpp   -- number of elements a page contains
     * @param q     -- extra query param, used for searching
     */
    @Get("/")
    @CustomAuth({ role: "ADMIN" })
    public async fetch(
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
    @Post("/")
    @CustomAuth({ role: "ADMIN" })
    public async save(@Required() @BodyParams("user") data: UserBasic): Promise<ResultContent<User>> {
        let user = await this.userRepository.findOne({ email: data.email });
        if (user) {
            throw new Exception(400, "User already exists!");
        }

        // generate a random password for a new user.
        if (!data.password) {
            data.password = this.userRepository.generateRandomPassword();
        }

        // save it
        user = await this.userRepository.save(data);

        // send email to user to informe the new password
        
        return new ResultContent<User>().withContent(user).withMessage("User was successfully created!");
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
    @Post("/:id/ativate")
    @CustomAuth({ role: "ADMIN" })
    public async ativate(@Required() @PathParams("id") id: number): Promise<any> {
        await this.userRepository.update(id, { active: true });
        return { message: "User successfully ativated." };
    }

    /**
     * Desativate a user.
     * @param id                            -- user id.
     */
    @Post("/:id/desativate")
    @CustomAuth({ role: "ADMIN" })
    public async desativate(@Required() @PathParams("id") id: number): Promise<any> {
        await this.userRepository.update(id, { active: false });
        return { message: "User successfully desativated." };
    }
    
}
