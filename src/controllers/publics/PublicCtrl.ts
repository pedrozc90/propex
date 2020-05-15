import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { PublicRepository } from "../../repositories";
import { Public, Page } from "../../entities";

@Controller("/publics")
export class PublicCtrl {

    constructor(private publicRepository: PublicRepository) {}

    @Get("/")
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<Public>> {
        return this.publicRepository.fetch({ page, rpp, q });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<Public[]> {
        return this.publicRepository.list({ q });
    }

    @Post("/")
    public async create(@BodyParams("public") entity: Public): Promise<Public | undefined> {
        return this.publicRepository.save(entity);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<Public | undefined> {
        return this.publicRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.publicRepository.deleteById(id);
    }

}
