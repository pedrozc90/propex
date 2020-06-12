import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required, Put, Req } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { Like } from "typeorm";

import { CustomAuth } from "../../services";
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
    @CustomAuth({})
    public async fetch(
        @QueryParams("page") page: number = 1,
        @QueryParams("rpp") rpp: number = 15,
        @QueryParams("q") q?: string
    ): Promise<Page<ExtensionLine>> {
        const params: any = {};
        if (rpp > 0) {
            params.skip = (page - 1) * rpp;
            params.take = rpp;
        }
        if (q) {
            params.where = [
                { name: Like(`%${q}%`) },
                { operation: Like(`%${q}%`) }
            ];
        };
        // if (project) {
        //     params.join = {
        //         alias: "el",
        //         innerJoin: { projects: "el.projects" }
        //     };
        // }
        return Page.of(await this.extensionLineRepository.find(params), page, rpp);
    }

    /**
     * Create a new extension lines.
     * @param request                       -- express request object.
     * @param extensionLine                 -- extension line data.
     */
    @Post("")
    @CustomAuth({ role: "ADMIN" })
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
    @CustomAuth({ role: "ADMIN" })
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
    @CustomAuth({})
    public async get(@Required() @PathParams("id") id: number): Promise<ExtensionLine | undefined> {
        return this.extensionLineRepository.findById(id);
    }

    /**
     * Delete a extension line by its it.
     * @param id                            -- extension line id.
     */
    @Delete("/:id")
    @CustomAuth({ role: "ADMIN" })
    public async delete(@Required() @PathParams("id") id: number): Promise<any> {
        return this.extensionLineRepository.deleteById(id);
    }

}
