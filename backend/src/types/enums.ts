export enum Role {
    MASTER = "master",
    ADMIN = "admin",
    MEMBER = "member"
}

export enum AgeRangeEnum {
    UNTIL_12 = 'Até 12 anos incompletos',
    UNTIL_18 = 'Até 18 anos',
    FROM_19_TO_25 = 'De 19 a 25 anos',
    FROM_26_TO_30 = 'De 26 a 30 anos',
    FROM_31_TO_50 = 'De 31 a 50 anos',
    FROM_51_TO_60 = 'De 51 a 60 anos',
    FROM_61_TO_70 = 'De 61a 70 anos',
    OLDER_THAN_70 = 'Acima de 70 anos'
}

export type RoleKey = keyof typeof Role;
export type AgeRangeEnumKey = keyof typeof AgeRangeEnum;
