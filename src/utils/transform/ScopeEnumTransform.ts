import { ValueTransformer } from "typeorm";

import { Scope, ScopeKey } from "../../types";

export class ScopeEnumValueTransformer implements ValueTransformer {

    /**
     * Used to marshal data when writing to the database.
     * @param value     -- value to be transformed.
     */
    public to(value: Scope): string | undefined {
        return value.key;
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value     -- value read from database.
     */
    public from(value: string | ScopeKey): Scope | undefined {
        return (Scope as any)[value];
    }

}

export const ScopeEnumTransformer = new ScopeEnumValueTransformer();
