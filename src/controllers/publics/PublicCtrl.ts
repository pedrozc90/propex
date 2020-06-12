import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required } from "@tsed/common";

import { PublicRepository } from "../../repositories";
import { Public, Page } from "../../entities";
import { CustomAuth } from "../../services";
import { Like } from "typeorm";

@Controller("/publics")
export class PublicCtrl {

    constructor(private publicRepository: PublicRepository) {}

    /**
     * Return a paginated list of publics.
     * @param page                          -- page number.
     * @param rpp                           -- number of entities per page.
     * @param q                             -- search query string.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<Public>> {
        const params: any = {};
        if (rpp > 0) {
            params.skip = (page - 1) * rpp;
            params.take = rpp;
        }
        if (q) {
            params.where = [
                { name: Like(`%${q}%`) },
                { cras: Like(`%${q}%`) }
            ];
        };
        return Page.of(await this.publicRepository.find(params), page, rpp);
    }

    /**
     * Create/Update a public data.
     * @param context                       -- user context.
     * @param data                          -- public data.
     */
    @Post("")
    @CustomAuth({ role: "ADMIN" })
    public async save(@Required() @BodyParams("public") data: Public): Promise<Public | undefined> {
        return this.publicRepository.save(data);
    }

    /**
     * Search for a public by id.
     * @param id                            -- public id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<Public | undefined> {
        return this.publicRepository.findById(id);
    }

    /**
     * Delete a public from database.
     * @param id                            -- public id.
     */
    @Delete("/:id")
    @CustomAuth({ role: "ADMIN" })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.publicRepository.deleteById(id);
    }

}
