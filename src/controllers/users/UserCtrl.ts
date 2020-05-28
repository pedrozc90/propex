/* eslint-disable indent */
import { Controller, Get, QueryParams, Required, BodyParams, Post, PathParams } from "@tsed/common";
import { EntityManager, Transaction, TransactionManager } from "typeorm";

import { UserRepository } from "../../repositories";
import { User, Page, ResultContent } from "../../entities";
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
    @CustomAuth({ scope: [ "ADIMIN" ] })
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<User>> {
        const query = await this.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.student", "student")
            .leftJoinAndSelect("user.collaborator", "collaborator");

        if (q) {
            query.where(`user.email LIKE %${q}%`)
                .orWhere(`user.name LIKE %${q}%`);
        }
            
        query.skip((page - 1) * rpp)
            .take(rpp)
            .getMany();

        return Page.of(await query.getMany(), page, rpp);
    }

    @Post("/")
    @CustomAuth({ scope: [ "ADMIN" ] })
    public async create(@Required() @BodyParams("user") data: User): Promise<any> {
        let user = await this.userRepository.findOne({ where: { email: data.email } });
        if (user) {
            throw new Exception(300, "User already exists!");
        }

        // generate a random password for a new user.
        if (!data.password) {
            data.password = "123456";
        }

        // save it
        user = await this.userRepository.save(data);

        // send email to user to informe the new password
        
        return new ResultContent().withContent(user).withMessage("User was successfully created!");
    }

    @Get("/:id")
    @CustomAuth({ scope: [ "ADIMIN" ] })
    public async get(@PathParams("id") id: number): Promise<User | undefined> {
        return this.userRepository.createQueryBuilder("user")
            .leftJoinAndSelect("user.student", "student")
            .leftJoinAndSelect("user.collaborator", "collaborator")
            .where("user.id = :id", { id })
            .getOne();
    }
    
}
