import { Repository, ObjectLiteral } from "typeorm";

import { Page } from "../../entities";
import { IOptions } from "../../types";

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
            .skip((page - 1) * rpp).limit(rpp);
        
        return Page.of(await query.getMany(), page, rpp);
    }

    /**
     * Fetch a list of documents from a collection.
     * @param options   -- pagination and search options
     */
    public async list(options: IOptions): Promise<T[]> {
        return this.find({});
    }

    /**
     * Find a document by its id.
     * @param _id       -- document id
     */
    public async findById(id: number | string): Promise<T | undefined> {
        return this.findOne(id, { relations: this.relations });
    }

}
