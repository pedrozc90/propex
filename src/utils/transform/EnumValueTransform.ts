/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import {
    findEnumKey,
    AgeRange, AgeRangeKey,
    AttachmentType, AttachmentTypeKey,
    PublicationType, PublicationTypeKey
} from "../../types";

export class EnumValueTransformer<T, K> implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: T): K | any {
        if (!value) return null;
        return findEnumKey(this.e, value);
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: K | string | any): T | any {
        return this.e[value];
    }

    /**
     * Create a transformer for a enum.
     * @param e -- enum
     */
    public static of<T>(e: T): EnumValueTransformer<T, keyof T> {
        return new EnumValueTransformer<T, keyof T>(e);
    }

}

// export const UserRoleEnumTransformer = new EnumValueTransformer<Role, string>(Role);
export const AgeRangeEnumTransformer = new EnumValueTransformer<AgeRange, AgeRangeKey>(AgeRange);
export const AttachmentTypeEnumTransformer = new EnumValueTransformer<AttachmentType, AttachmentTypeKey>(AttachmentType);
export const PublicationTypeEnumTransformer = new EnumValueTransformer<PublicationType, PublicationTypeKey>(PublicationType);
