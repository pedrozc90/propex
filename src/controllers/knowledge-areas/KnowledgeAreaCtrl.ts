import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Put } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { KnowledgeAreaRepository } from "../../repositories";
import { KnowledgeArea, Page } from "../../entities";

@Controller("/knowledge-areas")
export class KnowledgeAreaCtrl {

    constructor(private knowledgeAreaRepository: KnowledgeAreaRepository) {}

    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<KnowledgeArea>> {
        return this.knowledgeAreaRepository.fetch(page, rpp, q);
    }

    @Post("")
    @Authenticated({})
    public async create(@BodyParams("knowledgeArea") knowledgeArea: KnowledgeArea): Promise<KnowledgeArea | undefined> {
        return this.knowledgeAreaRepository.save(knowledgeArea);
    }

    @Put("")
    @Authenticated({})
    public async update(@BodyParams("knowledgeArea") data: KnowledgeArea): Promise<KnowledgeArea | undefined> {
        let knowledgeArea = await this.knowledgeAreaRepository.findOne({ id: data.id });
        if (!knowledgeArea) {
            throw new NotFound("Knowledge area not found.");
        }

        knowledgeArea = this.knowledgeAreaRepository.merge(knowledgeArea, data);

        return this.knowledgeAreaRepository.save(knowledgeArea);
    }

    @Get("/:id")
    @Authenticated({})
    public async get(@PathParams("id") id: number): Promise<KnowledgeArea | undefined> {
        return this.knowledgeAreaRepository.findById(id);
    }

    @Delete("/:id")
    @Authenticated({})
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.knowledgeAreaRepository.deleteById(id);
    }

}
