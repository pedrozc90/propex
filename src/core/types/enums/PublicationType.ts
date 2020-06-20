import { Property } from "@tsed/common";

export class PublicationType {

    public static readonly ARTIGO = new PublicationType("ARTIGO", "artigo");
    public static readonly CAPTULO = new PublicationType("CAPTULO", "captulo");
    public static readonly RESUMO = new PublicationType("RESUMO", "resumo");

    @Property({ name: "key" })
    public readonly key: string;

    @Property({ name: "description" })
    public readonly description: string;

    constructor(key: string, description: string) {
        this.key = key;
        this.description = description;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): PublicationType[] {
        return PublicationType.keys.map((key: string) => PublicationType[key as PublicationTypeKey] as PublicationType);
    }

}

export type PublicationTypeKey = keyof typeof PublicationType;
