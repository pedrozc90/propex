import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { Like } from "typeorm";

import { PublicRepository } from "../../repositories";
import { Public, Page } from "../../entities";
import { Authenticated } from "../../core/services";

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
    @Authenticated({})
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
    @Authenticated({ role: "ADMIN" })
    public async create(
        @Req() request: Req,
        @Required() @BodyParams("public") data: Public
    ): Promise<Public | undefined> {
        const p = await this.publicRepository.findOne(data.id);
        if (p) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a public data.`);
        }
        return this.publicRepository.save(data);
    }

    /**
     * Create/Update a public data.
     * @param context                       -- user context.
     * @param data                          -- public data.
     */
    @Put("")
    @Authenticated({ role: "ADMIN" })
    public async update(
        @Required() @BodyParams("public") data: Public
    ): Promise<Public | undefined> {
        let p = await this.publicRepository.findOne(data.id);
        if (!p) {
            throw new NotFound("Public not found.");
        }
        p = this.publicRepository.merge(p, data);
        return this.publicRepository.save(data);
    }

    /**
     * Search for a public by id.
     * @param id                            -- public id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<Public | undefined> {
        return this.publicRepository.findById(id);
    }

    /**
     * Delete a public from database.
     * @param id                            -- public id.
     */
    @Delete("/:id")
    @Authenticated({ role: "ADMIN" })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.publicRepository.deleteById(id);
    }

}
