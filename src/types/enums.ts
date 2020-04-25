export enum AgeRange {
    UNTIL_12 = "Até 12 anos incompletos",
    UNTIL_18 = "Até 18 anos",
    FROM_19_TO_25 = "De 19 a 25 anos",
    FROM_26_TO_30 = "De 26 a 30 anos",
    FROM_31_TO_50 = "De 31 a 50 anos",
    FROM_51_TO_60 = "De 51 a 60 anos",
    FROM_61_TO_70 = "De 61a 70 anos",
    OLDER_THAN_70 = "Acima de 70 anos"
}

export enum PublicationType {
    ARTIGO = "artigo",
    CAPTULO = "captulo",
    RESUMO = "resumo"
}

export enum AttachmentType {
    DOCUMENT = "document",
    IMAGE = "image",
    VIDEO = "video",
    PUBLICATION = "publication",
    EVENT = "event",
    ASSIGNS_LIST = "assigns_list",
    OTHER = "other"
}

export type AgeRangeKey = keyof typeof AgeRange;
export type PublicationTypeKey = keyof typeof PublicationType;
export type AttachmentTypeKey = keyof typeof AttachmentType;

/**
 * Returns enum key of a specified value.
 * @param e -- enum type.
 * @param v -- enum value to be found.
 */
export function findEnumKey(e: any, v: any): any | null {
    return Object.keys(e).filter((k) => e[k] === v)[0] || null;
}
