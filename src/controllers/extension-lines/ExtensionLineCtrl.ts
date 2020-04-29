import { Controller, Get, QueryParams, PathParams, Delete, Post, BodyParams } from "@tsed/common";

import { ExtensionLineRepository } from "../../repositories";
import { ExtensionLine, Page } from "../../entities";
import { DeleteResult } from "typeorm";
import { HTTPException } from "ts-httpexceptions";

@Controller("/extension_lines")
export class ExtensionLineCtrl {

    constructor(private extensionLineRepository: ExtensionLineRepository) {}

    @Get("/")
    public async fetch(@QueryParams("page") page: number, @QueryParams("rpp") rpp: number, @QueryParams("q") q: string): Promise<Page<ExtensionLine>> {
        return this.extensionLineRepository.fetch({ page, rpp, q });
    }

    @Get("/list")
    public async list(@QueryParams("q") q: string): Promise<ExtensionLine[]> {
        return this.extensionLineRepository.list({ q });
    }

    @Post("")
    public async create(@BodyParams("extensionLine") extensionLine: ExtensionLine): Promise<ExtensionLine | undefined> {
        if (!extensionLine.id && !extensionLine.number) {
            const { max } = await this.extensionLineRepository.createQueryBuilder("el")
                .select("MAX(el.number)", "max")
                .getRawOne();
            if (max) {
                extensionLine.number = max + 1;
            }
        }
        return this.extensionLineRepository.save(extensionLine);
    }

    @Get("/:id")
    public async get(@PathParams("id") id: number): Promise<ExtensionLine | undefined> {
        return this.extensionLineRepository.findById(id);
    }

    @Delete("/:id")
    public async delete(@PathParams("id") id: number): Promise<any> {
        // response example:
        // {
        //     "raw": {
        //       "fieldCount": 0,
        //       "affectedRows": 1,
        //       "insertId": 0,
        //       "info": "",
        //       "serverStatus": 2,
        //       "warningStatus": 0
        //     },
        //     "affected": 1
        // }
        const result: DeleteResult = await this.extensionLineRepository.delete(id);
        if (!result.raw || result.raw.serverStatus !== 2) {
            throw new HTTPException(404, "Error while deleting from extension_lines table.");
        }
        if (result.raw.affected === 0) {
            return { message: `Row ${id} do not exists.` };
        }
        return { message: `Row ${id} was successfully deleted.` };
    }

}
