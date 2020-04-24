import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { ExtensionLineRepository } from "../../repositories";
import { ExtensionLine, Page } from "../../entities";
import { IOptions } from "../../types";

@Controller("/extension_lines")
export class ExtensionLineCtrl {

    constructor(private ExtensionLineRepository: ExtensionLineRepository) {}

    @Get("/")
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<ExtensionLine>> {
        const options: IOptions = {};
        options.page = page || 1;
        options.rpp = rpp || 0;
        options.q = q || undefined;

        return this.ExtensionLineRepository.fetch({ ...options });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<ExtensionLine[]> {
        return this.ExtensionLineRepository.list({ q });
    }

    @Post("")
    public async create(@BodyParams("extensionLine") extensionLine: ExtensionLine): Promise<ExtensionLine | undefined> {
        return this.ExtensionLineRepository.save(extensionLine);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<ExtensionLine | undefined> {
        return this.ExtensionLineRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.ExtensionLineRepository.delete(id);
    }

}
