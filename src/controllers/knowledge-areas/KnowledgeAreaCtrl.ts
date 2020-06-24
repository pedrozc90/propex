import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Put, Required, Req } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";
import { Equal } from "typeorm";

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
    @Authenticated({ role: "ADMIN" })
    public async create(
        @Req() request: Req,
        @Required() @BodyParams("knowledgeArea") knowledgeArea: KnowledgeArea
    ): Promise<KnowledgeArea | undefined> {
        let ka = await this.knowledgeAreaRepository.findOne({
            where: [
                { id: knowledgeArea.id },
                { name: Equal(knowledgeArea.name) }
            ]
        });
        if (ka) {
            throw new BadRequest(`Please, use PUT ${request.path} to update a theme area data.`);
        }
        ka = this.knowledgeAreaRepository.create(knowledgeArea);
        return this.knowledgeAreaRepository.save(knowledgeArea);
    }

    @Put("")
    @Authenticated({ role: "ADMIN" })
    public async update(
        @Required() @BodyParams("knowledgeArea") knowledgeArea: KnowledgeArea
    ): Promise<KnowledgeArea | undefined> {
        let ka = await this.knowledgeAreaRepository.findOne({
            where: [
                { id: knowledgeArea.id },
                { name: Equal(knowledgeArea.name) }
            ]
        });
        if (!ka) {
            throw new NotFound("Knowledge area not found.");
        }
        ka = this.knowledgeAreaRepository.merge(ka, knowledgeArea);
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
