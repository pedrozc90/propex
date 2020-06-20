import { ValueTransformer } from "typeorm";

import { PublicationType, PublicationTypeKey } from "../../types";

export class PublicationTypeEnumValueTransformer implements ValueTransformer {
    
    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: PublicationType): string | undefined {
        return value.key;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string | PublicationTypeKey): PublicationType {
        return (PublicationType as any)[value];
    }

}

export const PublicationTypeEnumTransformer = new PublicationTypeEnumValueTransformer();
