import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, $log, Locals } from "@tsed/common";

import { ThemeAreaRepository, ProjectThemeAreaRepository } from "../../repositories";
import { ThemeArea, Page } from "../../entities";
import { CustomAuth } from "../../services";
import { response } from "express";
import { IContext } from "src/types";

@Controller("/theme-areas")
export class ThemeAreaCtrl {

    constructor(private themeAreaRepository: ThemeAreaRepository,
        private projectThemeAreaRepository: ProjectThemeAreaRepository) {
        // initialize stuff here
    }

    /**
     * Return a paginated list of theme areas.
     * @param page                          -- page number.
     * @param rpp                           -- number of entities per page.
     * @param q                             -- search query string.
     */
    @Get("")
    @CustomAuth({})
    public async fetch(@Locals("context") context: IContext,
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<ThemeArea>> {
        return this.themeAreaRepository.fetch({ page, rpp, q });
    }

    /**
     * Create/Update a theme area data.
     * @param context                       -- user context.
     * @param themeArea                     -- theme area data.
     */
    @Post("")
    @CustomAuth({ role: "ADMIN" })
    public async save(@Locals("context") context: IContext,
        @Required() @BodyParams("themeArea") themeArea: ThemeArea
    ): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.save(themeArea);
    }

    /**
     * Return the complete list of theme areas.
     * @param q                             -- search query string.
     */
    @Get("/list")
    @CustomAuth({})
    public async list(@Locals("context") context: IContext, @QueryParams("q") q?: string): Promise<ThemeArea[]> {
        return this.themeAreaRepository.list({ q });
    }

    /**
     * Search for a theme area by id.
     * @param id                            -- theme area id.
     */
    @Get("/:id")
    @CustomAuth({})
    public async get(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number
    ): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.findById(id);
    }

    /**
     * Delete a theme area from database.
     * @param id                            -- theme area id.
     */
    @Delete("/:id")
    @CustomAuth({ role: "ADMIN" })
    public async delete(@Locals("context") context: IContext,
        @Required() @PathParams("id") id: number
    ): Promise<any> {
        return this.themeAreaRepository.deleteById(id);
    }

}
