import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, Put, Req } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";
import { Equal } from "typeorm";

import { ThemeAreaRepository } from "../../repositories";
import { ThemeArea, Page } from "../../entities";
import { Authenticated } from "../../core/services";

@Controller("/theme-areas")
export class ThemeAreaCtrl {

    constructor(private themeAreaRepository: ThemeAreaRepository) {}

    /**
     * Return a paginated list of theme areas.
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
    ): Promise<Page<ThemeArea>> {
        return this.themeAreaRepository.fetch({ page, rpp, q });
    }

    /**
     * Create a theme area data.
     * @param context                       -- user context.
     * @param themeArea                     -- theme area data.
     */
    @Post("")
    @Authenticated({ role: "ADMIN" })
    public async create(
        @Req() request: Req,
        @Required() @BodyParams("themeArea") themeArea: ThemeArea
    ): Promise<ThemeArea | undefined> {
        let ta = await this.themeAreaRepository.findOne({
            where: [
                { id: themeArea.id },
                { name: Equal(themeArea.name) }
            ]
        });
        if (ta) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a theme area data.`);
        }
        ta = this.themeAreaRepository.create(themeArea);
        return this.themeAreaRepository.save(ta);
    }

    /**
     * Update a theme area data.
     * @param context                       -- user context.
     * @param themeArea                     -- theme area data.
     */
    @Put("")
    @Authenticated({ role: "ADMIN" })
    public async update(
        @Required() @BodyParams("themeArea") themeArea: ThemeArea
    ): Promise<ThemeArea | undefined> {
        let ta = await this.themeAreaRepository.findOne({
            where: [
                { id: themeArea.id },
                { name: Equal(themeArea.name) }
            ]
        });
        if (!ta) {
            throw new NotFound("ThemeArea not found.");
        }
        ta = this.themeAreaRepository.merge(ta, themeArea);
        return this.themeAreaRepository.save(themeArea);
    }

    /**
     * Search for a theme area by id.
     * @param id                            -- theme area id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@Required() @PathParams("id") id: number): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.findById(id);
    }

    /**
     * Delete a theme area from database.
     * @param id                            -- theme area id.
     */
    @Delete("/:id")
    @Authenticated({ role: "ADMIN" })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.themeAreaRepository.deleteById(id);
    }

}
