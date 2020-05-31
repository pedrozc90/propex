import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, Locals } from "@tsed/common";

import { PublicRepository } from "../../repositories";
import { Public, Page } from "../../entities";
import { CustomAuth } from "src/services";
import { IContext } from "src/types";

@Controller("/publics")
export class PublicCtrl {

    constructor(private publicRepository: PublicRepository) {}

    /**
     * Return a paginated list of publics.
     * @param page                          -- page number.
     * @param rpp                           -- number of entities per page.
     * @param q                             -- search query string.
     */
    @Get("/")
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number,
        @QueryParams("rpp") rpp: number,
        @QueryParams("q") q: string
    ): Promise<Page<Public>> {
        return this.publicRepository.fetch({ page, rpp, q });
    }

    /**
     * Return the complete list of publics.
     * @param q                             -- search query string.
     */
    @Get("/list")
    @CustomAuth({})
    public async list(@QueryParams("q") q: string): Promise<Public[]> {
        return this.publicRepository.list({ q });
    }

    /**
     * Create/Update a public data.
     * @param context                       -- user context.
     * @param data                          -- public data.
     */
    @Post("/")
    @CustomAuth({ role: "ADMIN" })
    public async save(
        @Locals("context") context: IContext,
        @Required() @BodyParams("public") data: Public
    ): Promise<Public | undefined> {
        return this.publicRepository.save(data);
    }

    /**
     * Search for a public by id.
     * @param id                            -- public id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@PathParams("id") id: number): Promise<Public | undefined> {
        return this.publicRepository.findById(id);
    }

    /**
     * Delete a public from database.
     * @param id                            -- public id.
     */
    @Delete("/:id")
    @CustomAuth({ role: "ADMIN" })
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.publicRepository.deleteById(id);
    }

}
