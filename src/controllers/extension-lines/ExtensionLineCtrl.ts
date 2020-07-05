import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams, Required } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";

import { Authenticated } from "../../core/services";
import { ExtensionLineRepository } from "../../repositories";
import { ExtensionLine, Page, ResultContent } from "../../entities";

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
        const extensionLines = await this.extensionLineRepository.fetch({ page, rpp, q, projectId });
        return Page.of<ExtensionLine>(extensionLines, page, rpp);
    }

    /**
     * Create/Update a new extension lines.
     * @param request                       -- express request object.
     * @param extensionLine                 -- extension line data.
     */
    @Post("")
    @Authenticated({ role: "ADMIN" })
    public async save(@Required() @BodyParams("extensionLine") extensionLine: ExtensionLine): Promise<ResultContent<ExtensionLine>> {
        let el = await this.extensionLineRepository.findOne({ id: extensionLine.id });
        if (!el) {
            el = this.extensionLineRepository.create(extensionLine);
            if (!el.number) {
                const max = await this.extensionLineRepository.lastNumber();
                el.number = max + 1;
            }
        } else {
            el = this.extensionLineRepository.merge(el, extensionLine);
        }
        el = await this.extensionLineRepository.save(extensionLine);

        return ResultContent.of<ExtensionLine>(el).withMessage("ExtensionLine sucessfully saved.");
    }

    /**
     * Find extension line by id.
     * @param id                            -- extension line id.
     */
    @Get("/:id")
    @Authenticated({})
    public async get(@PathParams("id") id: number): Promise<ExtensionLine | undefined> {
        const el = await this.extensionLineRepository.findById(id);
        if (!el) {
            throw new NotFound("ExtensionLine not found.");
        }
        return el;
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
