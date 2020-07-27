export enum RoleEnum {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    COLLABORATOR = "COLLABORATOR",
    UNKOWN = "UNKNOWN"
}

export enum AgeRangeEnum {
    UNTIL_12 = "UNTIL_12",
    UNTIL_18 = "UNTIL_18",
    FROM_19_TO_25 = "FROM_19_TO_25",
    FROM_26_TO_30 = "FROM_26_TO_30",
    FROM_31_TO_50 = "FROM_31_TO_50",
    FROM_51_TO_60 = "FROM_51_TO_60",
    FROM_61_TO_70 = "FROM_61_TO_70",
    OLDER_THAN_70 = "OLDER_THAN_70"
}

export type RoleEnumKey = keyof typeof RoleEnum;
