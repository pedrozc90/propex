/* eslint-disable object-curly-newline */
import { ValueTransformer } from "typeorm";

import { Scope } from "../../types";

export class ScopeEnumValueTransformer implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: Scope): string | undefined {
        return value.value;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string): Scope | undefined {
        return this.e[value];
    }

}

export const ScopeEnumTransformer = new ScopeEnumValueTransformer(Scope);
