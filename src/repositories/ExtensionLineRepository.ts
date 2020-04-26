import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine } from "../entities";
import { Like } from "typeorm";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {

    public async list(options: any): Promise<ExtensionLine[]> {
        const params: any = {};
        if (options.q) {
            params.where = [
                { name: Like(`%${options.q}%`) },
                { operation: Like(`%${options.q}%`) }
            ];
        };
        return this.find(params);
    }

}
