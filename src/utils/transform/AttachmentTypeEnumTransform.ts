/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import { AttachmentType } from "../../types";

export class AttachmentTypeEnumValueTransformer implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: AttachmentType): string | undefined {
        return value.value;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string): AttachmentType {
        return this.e[value];
    }

}

export const AttachmentTypeEnumTransformer = new AttachmentTypeEnumValueTransformer(AttachmentType);
