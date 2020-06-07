import { ValueTransformer } from "typeorm";

import { findEnumKey } from "../../types";

export class EnumValueTransformer<T, K> implements ValueTransformer {

    constructor(private e: any) {}

    /**
     * Used to marshal data when writing to the database.
     * @param value                         -- value to be transformed.
     */
    public to(value: T): string {
        return findEnumKey(this.e, value);
    }

    /**
     * Used to unmarshal data when reading from the database.
     * @param value                         -- value read from database.
     */
    public from(value: string | K): T | undefined {
        return (this.e as any)[value];
    }

    /**
     * Create a transformer for a enum.
     * @param e                             -- enum
     */
    public static of<T>(e: T): EnumValueTransformer<T, keyof T> {
        return new EnumValueTransformer<T, keyof T>(e);
    }

}

// export const ExampleEnumTransformer = new EnumValueTransformer<Example, ExampleKey>(Example);
