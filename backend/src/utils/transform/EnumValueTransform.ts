import { ValueTransformer } from "typeorm";
import { AgeRangeEnum } from "src/types";

export class EnumValueTransformer implements ValueTransformer {

    constructor(private e: any) {}

    public from(value: any): any {
        if (value) {
            return this.e[value];
        }
    }

    public to(value: string | any): string | undefined {
        if (!value) return;
        if (typeof value === "string") {
            return value;
        }
        return value.value;
    }

    public static of(e: any): EnumValueTransformer {
        return new EnumValueTransformer(e);
    }

}

export const TransformerAgeRangeEnum = EnumValueTransformer.of(AgeRangeEnum);
