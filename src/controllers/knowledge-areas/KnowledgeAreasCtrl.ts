import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { KnowledgeAreaRepository } from "../../repositories";
import { KnowledgeArea, Page } from "../../entities";

@Controller("/knowledge-areas")
export class KnowledgeAreasCtrl {

    constructor(private knowledgeAreaRepository: KnowledgeAreaRepository) {}

    @Get("/")
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<KnowledgeArea>> {
        return this.knowledgeAreaRepository.fetch({ page, rpp, q });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<KnowledgeArea[]> {
        return this.knowledgeAreaRepository.list({ q });
    }

    @Post("/")
    public async create(@BodyParams("knowledgeArea") knowledgeArea: KnowledgeArea): Promise<KnowledgeArea | undefined> {
        return this.knowledgeAreaRepository.save(knowledgeArea);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<KnowledgeArea | undefined> {
        return this.knowledgeAreaRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.knowledgeAreaRepository.deleteById(id);
    }

}
