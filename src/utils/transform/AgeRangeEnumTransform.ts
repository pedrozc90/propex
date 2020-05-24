/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import { AgeRange } from "../../types";

export class AgeRangeEnumValueTransformer implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: AgeRange): string | undefined {
        return value.value;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string): AgeRange {
        return this.e[value];
    }

}

export const AgeRangeEnumTransformer = new AgeRangeEnumValueTransformer(AgeRange);
