import { Property } from "@tsed/common";

export class AgeRange {

    public static readonly UNTIL_12 = new AgeRange("UNTIL_12", "Até 12 anos incompletos", 0);
    public static readonly UNTIL_18 = new AgeRange("UNTIL_18", "Até 18 anos", 1);
    public static readonly FROM_19_TO_25 = new AgeRange("FROM_19_TO_25", "De 19 a 25 anos", 2);
    public static readonly FROM_26_TO_30 = new AgeRange("FROM_26_TO_30", "De 26 a 30 anos", 3);
    public static readonly FROM_31_TO_50 = new AgeRange("FROM_31_TO_50", "De 31 a 50 anos", 4);
    public static readonly FROM_51_TO_60 = new AgeRange("FROM_51_TO_60", "De 51 a 60 anos", 5);
    public static readonly FROM_61_TO_70 = new AgeRange("FROM_61_TO_70", "De 61 a 70 anos", 6);
    public static readonly OLDER_THAN_70 = new AgeRange("OLDER_THAN_70", "Acima de 70 anos", 7);

    @Property({ name: "key" })
    public readonly key: string;

    @Property({ name: "description" })
    public readonly description: string;

    @Property({ name: "order" })
    public readonly order: number;

    constructor(key: string, description: string, order: number) {
        this.key = key;
        this.description = description;
        this.order = order;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): AgeRange[] {
        return AgeRange.keys.map((key: string) => AgeRange[key as AgeRangeKey] as AgeRange);
    }

}

export type AgeRangeKey = keyof typeof AgeRange;
