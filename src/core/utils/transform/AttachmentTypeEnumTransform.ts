import { ValueTransformer } from "typeorm";

import { AttachmentType, AttachmentTypeKey } from "../../types";

export class AttachmentTypeEnumValueTransformer implements ValueTransformer {

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: AttachmentType): string | undefined {
        return value.key;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string | AttachmentTypeKey): AttachmentType | undefined {
        return (AttachmentType as any)[value];
    }

}

export const AttachmentTypeEnumTransformer = new AttachmentTypeEnumValueTransformer();
