import { Repository, ObjectLiteral, DeleteResult } from "typeorm";
import { HTTPException } from "@tsed/exceptions";

import { Page } from "../../entities";
import { IOptions } from "../../core/types";

export class GenericRepository<T extends ObjectLiteral> extends Repository<T> {

    constructor(protected relations: string []) {
        super();
    }

    /**
     * Fetch a list of documents from a collection.
     * @param options   -- pagination and search options
     */
    public async fetch(options: IOptions): Promise<Page<T>> {
        const page: number = options.page || 1;
        const rpp: number = options.rpp || 0;

        const query = this.createQueryBuilder()
            .skip((page - 1) * rpp).take(rpp);
        
        return Page.of(await query.getMany(), page, rpp);
    }

    /**
     * Fetch a list of documents from a collection.
     * @param options   -- pagination and search options
     */
    public async list(options: IOptions): Promise<T[]> {
        return this.find({ ...(options as any) });
    }

    /**
     * Find a document by its id.
     * @param _id       -- document id
     */
    public async findById(id: number): Promise<T | undefined> {
        return this.findOne(id);
    }

    public async deleteById(id: number): Promise<any> {
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
        const result: DeleteResult = await this.delete(id);
        if (!result.raw || result.raw.serverStatus !== 2) {
            throw new HTTPException(404, "Error while deleting from extension_lines table.");
        }
        if (result.raw.affected === 0) {
            return { message: `Row ${id} do not exists.` };
        }
        return { message: `Row ${id} was successfully deleted.` };
    }

}
