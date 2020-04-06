import { Repository, ObjectLiteral } from "typeorm";

import { Page } from "../models/generics/Page";
import { IOptions } from "../types/types";

export class GenericRepository<T extends ObjectLiteral> extends Repository<T> {

    // /**
    //  * Fetch all documents from a collection.
    //  * @param options   -- search options
    //  */
    // public async fetch(options: IOptions): Promise<T[]> {
    //     // return this.model.find({ ...options }).exec();
    //     return this.repository.find({});
    // }

    /**
     * Fetch a list of documents from a collection.
     * @param options   -- pagination and search options
     */
    public async fetch(options: IOptions): Promise<Page<T> | T[]> {
        const page: number = options.page || 1;
        const rpp: number = options.rpp || 0;

        const query = this.createQueryBuilder("name");

        let content: Page<T> | T[];
        if (rpp > 0) {
            content = await query.skip((page - 1) * rpp).limit(rpp).getMany();
            return Page.of(content, page, rpp);
        }
        return query.getMany();
    }

    /**
     * Find a document by its id.
     * @param _id       -- document id
     */
    public async findById(id: number | string): Promise<T | undefined> {
        return this.findOne(id);
    }

    // /**
    //  * Create or update a document.
    //  * @param document  -- document
    //  */
    // public async save(document: T): Promise<T> {
    //     // return this.repository.save(document);
    //     return document;
    // }

    // /**
    //  * Remove a document from table.
    //  * @param _id       -- document id
    //  */
    // public async remove(id: number | string): Promise<any> {
    //     return this.delete(id);
    // }

}
