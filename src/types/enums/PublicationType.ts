export class PublicationType {

    public static readonly ARTIGO = new PublicationType("ARTIGO", "artigo");
    public static readonly CAPTULO = new PublicationType("CAPTULO", "captulo");
    public static readonly RESUMO = new PublicationType("RESUMO", "resumo");

    constructor(private readonly key: string, public readonly name: string) {}

    public get value(): string {
        return this.key;
    }

    public static get keys(): string[] {
        return Object.keys(this);
    }

    public static get list(): PublicationType[] {
        return PublicationType.keys.map((key: string) => PublicationType[key as PublicationTypeKey] as PublicationType);
    }

}

export type PublicationTypeKey = keyof typeof PublicationType;
