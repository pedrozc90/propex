/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import {
    findEnumKey,
    AgeRangeEnum, AgeRangeEnumKey,
    AttachmentTypeEnum, AttachmentTypeEnumKey,
    PublicationTypeEnum, PublicationTypeEnumKey
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

export const TransformerAgeRangeEnum = new EnumValueTransformer<AgeRangeEnum, AgeRangeEnumKey>(AgeRangeEnum);
export const TransformerAttachmentTypeEnum = new EnumValueTransformer<AttachmentTypeEnum, AttachmentTypeEnumKey>(AttachmentTypeEnum);
export const TransformerPublicationTypeEnum = new EnumValueTransformer<PublicationTypeEnum, PublicationTypeEnumKey>(PublicationTypeEnum);
