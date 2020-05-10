import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { ThemeAreaRepository } from "../../repositories";
import { ThemeArea, Page } from "../../entities";

@Controller("/theme-areas")
export class ThemeAreaCtrl {

    constructor(private themeAreaRepository: ThemeAreaRepository) {}

    @Get("/")
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<ThemeArea>> {
        return this.themeAreaRepository.fetch({ page, rpp, q });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<ThemeArea[]> {
        return this.themeAreaRepository.list({ q });
    }

    @Post("/")
    public async create(@BodyParams("themeArea") themeArea: ThemeArea): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.save(themeArea);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<ThemeArea | undefined> {
        return this.themeAreaRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.themeAreaRepository.deleteById(id);
    }

}
