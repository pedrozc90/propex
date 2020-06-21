import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { ExtensionLineRepository } from "../../repositories";
import { ExtensionLine, Page } from "../../entities";

@Controller("/extension-lines")
export class ExtensionLineCtrl {

    constructor(private extensionLineRepository: ExtensionLineRepository) {}

    /**
     * Return a paginated list of extension lines.
     * @param page                          -- page number.
     * @param rpp                           -- rows per page.
     * @param q                             -- query text.
     * @param project                       -- project id.
     */
    @Get("")
    @Authenticated({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string,
        @QueryParams("project") projectId?: number
    ): Promise<Page<ExtensionLine>> {
        return this.extensionLineRepository.fetch(page, rpp, q, projectId);
    }

    /**
     * Create a new extension lines.
     * @param request                       -- express request object.
     * @param extensionLine                 -- extension line data.
     */
    @Post("")
    @Authenticated({ role: "ADMIN" })
    public async create(
        @Req() request: Req,
        @Required() @BodyParams("extensionLine") extensionLine: ExtensionLine
    ): Promise<ExtensionLine | undefined> {
        if (extensionLine.id) {
            throw new BadRequest(`Please, use PUT ${request.baseUrl} to update extension lines.`);
        }
        if (!extensionLine.number) {
            const max = await this.extensionLineRepository.lastNumber();
            extensionLine.number = max + 1;
        }
        return this.extensionLineRepository.save(extensionLine);
    }

    /**
     * Save extension line chagnes.
     * @param extensionLine                 -- extension line data.
     */
    @Put("")
    @Authenticated({ role: "ADMIN" })
    public async update(@Required() @BodyParams("extensionLine") extensionLine: ExtensionLine): Promise<ExtensionLine | undefined> {
        let el = await this.extensionLineRepository.findOne({ id: extensionLine.id });
        if (!el) {
            throw new NotFound("Extension line not found.");
        }
        el = this.extensionLineRepository.merge(el, extensionLine);
        return this.extensionLineRepository.save(extensionLine);
    }

    /**
     * Find extension line by id.
     * @param id                            -- extension line id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@PathParams("id") id: number): Promise<ExtensionLine | undefined> {
        return this.extensionLineRepository.findById(id);
    }

    /**
     * Delete a extension line by its it.
     * @param id                            -- extension line id.
     */
    @Delete("/:id")
    @Authenticated({ role: "ADMIN" })
    public async delete(@PathParams("id") id: number): Promise<any> {
        return this.extensionLineRepository.deleteById(id);
    }

}
