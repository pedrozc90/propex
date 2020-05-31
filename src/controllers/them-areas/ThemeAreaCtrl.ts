import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required } from "@tsed/common";

import { ThemeAreaRepository } from "../../repositories";
import { ThemeArea, Page } from "../../entities";
import { CustomAuth } from "../../services";

@Controller("/theme-areas")
export class ThemeAreaCtrl {

    constructor(private themeAreaRepository: ThemeAreaRepository) {}

    /**
     * Return a paginated list of theme areas.
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
    ): Promise<Page<ThemeArea>> {
        return this.themeAreaRepository.fetch({ page, rpp, q });
    }

    /**
     * Return the complete list of theme areas.
     * @param q                             -- search query string.
     */
    @Get("/list")
    @CustomAuth({})
    public async list(@QueryParams("q") q: string): Promise<ThemeArea[]> {
        return this.themeAreaRepository.list({ q });
    }

    /**
     * Create/Update a theme area data.
     * @param context                       -- user context.
     * @param themeArea                     -- theme area data.
     */
    @Post("/")
    @CustomAuth({ role: "ADMIN" })
    public async save(@BodyParams("themeArea") themeArea: ThemeArea): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.save(themeArea);
    }

    /**
     * Search for a theme area by id.
     * @param id                            -- theme area id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.findById(id);
    }

    /**
     * Delete a theme area from database.
     * @param id                            -- theme area id.
     */
    @Delete("/:id")
    @CustomAuth({ role: "ADMIN" })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.themeAreaRepository.deleteById(id);
    }

}
