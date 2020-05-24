/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import { PublicationType } from "../../types";

export class PublicationTypeEnumValueTransformer implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: PublicationType): string | undefined {
        return value.value;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string): PublicationType {
        return this.e[value];
    }

}

export const PublicationTypeEnumTransformer = new PublicationTypeEnumValueTransformer(PublicationType);
