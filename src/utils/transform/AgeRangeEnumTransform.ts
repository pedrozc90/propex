import { ValueTransformer } from "typeorm";

import { AgeRange } from "../../types";

export class AgeRangeEnumValueTransformer implements ValueTransformer {

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: AgeRange): string | undefined {
        return value.key;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string): AgeRange | undefined {
        return (AgeRange as any)[value];
    }

}

export const AgeRangeEnumTransformer = new AgeRangeEnumValueTransformer();
