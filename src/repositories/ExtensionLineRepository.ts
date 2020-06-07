import { EntityRepository } from "@tsed/typeorm";

import { GenericRepository } from "./generics/GenericRepository";
import { ExtensionLine } from "../entities";

@EntityRepository(ExtensionLine)
export class ExtensionLineRepository extends GenericRepository<ExtensionLine> {

    /**
     * Return the last number of extension lines.
     */
    public async lastNumber(): Promise<number> {
        const { max } = await this.createQueryBuilder("el")
            .select("MAX(el.number)", "max")
            .getRawOne();
        return max || 0;
    }

}
